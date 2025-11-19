import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CuentaCobroRepository } from '../../infrastructure/persistence/repositories/cuenta-cobro.repository';
import { FormatearFecha } from '../../utils/functions/formatear-fecha.util';
import { ClientePaqueteRepository } from '../../infrastructure/persistence/repositories/cliente-paquete.repository';
import { ProcesoGeneracionRepository } from '../../infrastructure/persistence/repositories/proceso-generacion.repository';
import { KafkaService } from '../../infrastructure/messaging/kafka/kafka.service';
import { EProcesoGeneracion } from '../../domain/enums/proceso-generacion.enum';
import { EEstadoProceso } from '../../domain/enums/estado-proceso.enum';
import { EEstadoCuentaCobro } from '../../domain/enums/estado-cuenta-cobro.enum';
import { EFrecuenciaTipo } from '../../domain/enums/frecuencia-tipo.enum';
import { ClientePaqueteModel } from '../../infrastructure/persistence/models/cliente-paquete.model';
import { IGeneracionCuentasCobroIniciada } from '../../domain/interfaces/kafka-messages.interface';
import { IPaginado } from '../../shared/interfaces/paginado.interface';
import { ICuentaCobroListado } from '../../infrastructure/persistence/repositories/interfaces/cuenta-cobro-repository.interface';

@Injectable()
export class CuentasCobroService {
  private readonly logger = new Logger(CuentasCobroService.name);

  constructor(private readonly kafkaService: KafkaService) {}

  async generarCuentasCobro(dias: number = 5): Promise<void> {
    this.logger.log(
      `Iniciando generación de cuentas de cobro para ${dias} días`,
    );

    const fechaObjetivo = moment.utc().add(dias, 'days');
    const inicioDia = fechaObjetivo.clone().startOf('day').toDate();
    const finDia = fechaObjetivo.clone().endOf('day').toDate();
    const fechaCobro = fechaObjetivo.clone().startOf('day').toDate();

    const proceso = await ProcesoGeneracionRepository.crearProceso({
      proceso: EProcesoGeneracion.GENERACION_CUENTAS_COBRO,
      diaProceso: fechaObjetivo.date(),
    });

    try {
      const mensajeInicio: IGeneracionCuentasCobroIniciada = {
        fechaObjetivo: fechaObjetivo.toISOString(),
        timestamp: moment.utc().toISOString(),
      };
      await this.kafkaService.enviarMensaje(
        'generacion_cuentas_cobro_iniciada',
        mensajeInicio,
      );
    } catch (error) {
      this.logger.error('Error al publicar evento de inicio:', error);
    }

    try {
      const paquetesActivos = await ClientePaqueteRepository.buscarActivos();

      const idsPaquetesElegibles = this.filtrarPaquetesElegibles(
        paquetesActivos,
        fechaObjetivo,
      );

      if (idsPaquetesElegibles.length === 0) {
        this.logger.log(
          'No se encontraron paquetes elegibles para generar cuentas de cobro',
        );
        await ProcesoGeneracionRepository.actualizarProceso(proceso.id, {
          estado: EEstadoProceso.EXITOSO,
          fechaFin: new Date(),
          procesosCreados: 0,
          observaciones: 'No se encontraron paquetes elegibles',
        });
        return;
      }

      const fechaCobroISO = fechaCobro.toISOString();
      const inicioDiaISO = inicioDia.toISOString();
      const finDiaISO = finDia.toISOString();
      const estadoPendiente = EEstadoCuentaCobro.PENDIENTE;
      const mesActual = fechaCobro.getUTCMonth() + 1;
      const anioActual = fechaCobro.getUTCFullYear();

      const exito = await CuentaCobroRepository.generarCuentasCobroMasivo(
        idsPaquetesElegibles,
        fechaCobroISO,
        inicioDiaISO,
        finDiaISO,
        estadoPendiente,
        mesActual,
        anioActual,
      );

      if (exito) {
        const fechaCobroFormateada = FormatearFecha.fechaUTC(fechaCobro);
        const cantidadGenerada =
          await CuentaCobroRepository.contarCuentasCobroGeneradas(
            fechaCobroFormateada,
          );

        await ProcesoGeneracionRepository.actualizarProceso(proceso.id, {
          estado: EEstadoProceso.EXITOSO,
          fechaFin: new Date(),
          procesosCreados: cantidadGenerada,
          observaciones: null,
        });

        this.logger.log(
          `Generación de cuentas de cobro completada. Se generaron ${cantidadGenerada} cuentas de cobro`,
        );

        // Publicar evento: Generación completada
        try {
          Logger.verbose(
            '✅ COBROS: Enviando mensaje Kafka - generacion_cuentas_cobro_completada',
            'CuentasCobroService',
          );
          await this.kafkaService.enviarMensaje(
            'generacion_cuentas_cobro_completada',
            {
              fechaCobro: fechaCobro.toISOString(),
              cantidadGenerada,
              timestamp: moment.utc().toISOString(),
            },
          );
        } catch (error) {
          this.logger.error(
            'Error al publicar evento de generación completada:',
            error,
          );
        }
      } else {
        throw new Error(
          'El proceso de generación no se completó correctamente',
        );
      }
    } catch (error) {
      this.logger.error(error);
      const mensajeError =
        error instanceof Error ? error.message : JSON.stringify(error);

      await ProcesoGeneracionRepository.actualizarProceso(proceso.id, {
        estado: EEstadoProceso.FALLIDO,
        fechaFin: new Date(),
        procesosCreados: 0,
        observaciones: mensajeError,
      });

      this.logger.error(`Error al generar cuentas de cobro: ${mensajeError}`);
      throw error;
    }
  }

  private filtrarPaquetesElegibles(
    paquetes: ClientePaqueteModel[],
    fechaObjetivo: moment.Moment,
  ): number[] {
    const idsElegibles: number[] = [];

    for (const paquete of paquetes) {
      const fechaInicio = moment.utc(paquete.fechaInicio);
      const fechaFin = paquete.fechaFin ? moment.utc(paquete.fechaFin) : null;

      if (fechaInicio.isAfter(fechaObjetivo)) {
        continue;
      }

      if (fechaFin && fechaFin.isBefore(fechaObjetivo)) {
        continue;
      }

      let esElegible = false;

      const frecuenciaTipo = paquete.frecuenciaTipo;

      if (frecuenciaTipo === EFrecuenciaTipo.MENSUAL) {
        if (paquete.diaCobro === fechaObjetivo.date()) {
          esElegible = true;
        }
      } else if (frecuenciaTipo === EFrecuenciaTipo.SEMANAS) {
        if (paquete.frecuenciaValor && paquete.frecuenciaValor > 0) {
          const semanasDesdeInicio = fechaObjetivo.diff(
            fechaInicio,
            'weeks',
            true,
          );
          const numeroCiclo = Math.floor(
            semanasDesdeInicio / paquete.frecuenciaValor,
          );
          const fechaCicloEsperado = fechaInicio
            .clone()
            .add(numeroCiclo * paquete.frecuenciaValor, 'weeks');

          const diaSemanaInicio = fechaInicio.day();
          const diaSemanaObjetivo = fechaObjetivo.day();

          if (
            diaSemanaInicio === diaSemanaObjetivo &&
            fechaCicloEsperado.isSame(fechaObjetivo, 'day')
          ) {
            esElegible = true;
          }
        }
      }

      if (esElegible) {
        idsElegibles.push(paquete.id);
      }
    }

    return idsElegibles;
  }

  async listarCuentasCobro(
    tenantId: number,
    pagina: number,
    tamanoPagina: number,
    filtro?: string,
    estado?: string,
    tienePdf?: string,
    siEnvioCorreo?: string,
    fechaInicio?: string,
    fechaFin?: string,
    paqueteId?: number,
  ): Promise<IPaginado<ICuentaCobroListado>> {
    const offset = (pagina - 1) * tamanoPagina;

    let fechaInicioDate: Date | undefined;
    let fechaFinDate: Date | undefined;

    if (fechaInicio) {
      fechaInicioDate = moment.utc(fechaInicio).startOf('day').toDate();
    }

    if (fechaFin) {
      fechaFinDate = moment.utc(fechaFin).endOf('day').toDate();
    }

    const resultado = await CuentaCobroRepository.listarCuentasCobroPaginadas(
      tenantId,
      offset,
      tamanoPagina,
      filtro,
      estado,
      tienePdf,
      siEnvioCorreo,
      fechaInicioDate,
      fechaFinDate,
      paqueteId,
    );

    const total = resultado.count;
    const totalPaginas = tamanoPagina > 0 ? Math.ceil(total / tamanoPagina) : 0;

    return {
      meta: {
        total,
        pagina,
        tamanoPagina,
        totalPaginas,
      },
      data: resultado.rows,
    };
  }

  obtenerEstados(): Array<{ valor: string; etiqueta: string }> {
    return [
      { valor: 'pendiente', etiqueta: 'Pendiente' },
      { valor: 'pagada', etiqueta: 'Pagada' },
      { valor: 'mora', etiqueta: 'Mora' },
      { valor: 'cancelada', etiqueta: 'Cancelada' },
    ];
  }

  async obtenerCuentaCobroPorId(
    tenantId: number,
    id: number,
  ): Promise<{ id: number; urlPdf: string | null } | null> {
    return await CuentaCobroRepository.obtenerPorId(tenantId, id);
  }

  async obtenerPdfCuentaCobro(
    tenantId: number,
    id: number,
  ): Promise<{ buffer: Buffer; nombreArchivo: string }> {
    const cuentaCobro: { id: number; urlPdf: string | null } | null =
      await CuentaCobroRepository.obtenerPorId(tenantId, id);

    if (!cuentaCobro || !cuentaCobro.urlPdf) {
      throw new Error('Cuenta de cobro no encontrada o sin PDF generado');
    }

    const rutaPdf: string = cuentaCobro.urlPdf;

    try {
      await fs.access(rutaPdf);
    } catch {
      throw new Error('El archivo PDF no existe en el sistema de archivos');
    }

    const nombreArchivo = path.basename(rutaPdf);
    const bufferPdf = await fs.readFile(rutaPdf);

    return {
      buffer: bufferPdf,
      nombreArchivo,
    };
  }
}
