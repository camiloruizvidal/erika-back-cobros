import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
  Param,
  ParseIntPipe,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import type { Response, Request } from 'express';
import { CuentasCobroService } from '../../application/services/cuentas-cobro.service';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';
import { GenerarCuentasCobroResponseDto } from '../dto/generar-cuentas-cobro.response.dto';
import { PaginadoCuentasCobroRequestDto } from '../dto/paginado-cuentas-cobro.request.dto';
import { CuentasCobroPaginadasResponseDto } from '../dto/cuentas-cobro-paginadas.response.dto';
import { EstadosCuentaCobroResponseDto } from '../dto/estados-cuenta-cobro.response.dto';
import { PaginadoPagosRequestDto } from '../dto/paginado-pagos.request.dto';
import { PagosPaginadasResponseDto } from '../dto/pagos-paginadas.response.dto';
import { JwtTenantGuard } from '../guards/jwt-tenant.guard';
import { IPaginado } from '../../shared/interfaces/paginado.interface';
import { ICuentaCobroListado } from '../../infrastructure/persistence/repositories/interfaces/cuenta-cobro-repository.interface';

interface RequestConTenant extends Request {
  tenantId: number;
}

@ApiTags('Cuentas de Cobro')
@Controller('api/v1/billing')
export class CuentasCobroController {
  private readonly logger = new Logger(CuentasCobroController.name);

  constructor(
    private readonly cuentasCobroService: CuentasCobroService,
    private readonly manejadorError: ManejadorError,
  ) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Generar cuentas de cobro',
    description:
      'Inicia el proceso asíncrono de generación de cuentas de cobro para paquetes activos con fecha de cobro en 5 días',
  })
  @ApiCreatedResponse({
    description: 'Proceso de generación iniciado exitosamente',
    type: GenerarCuentasCobroResponseDto,
  })
  generarCuentasCobro(): GenerarCuentasCobroResponseDto {
    Logger.verbose(
      '✅ COBROS: Se recibió petición POST /api/v1/billing/generate',
      'CuentasCobroController',
    );
    try {
      this.cuentasCobroService.generarCuentasCobro().catch((error) => {
        this.logger.error(
          `Error en proceso asíncrono de generación de cuentas de cobro: ${JSON.stringify(error)}`,
        );
      });

      return plainToInstance(GenerarCuentasCobroResponseDto, {
        mensaje: 'Proceso de generación de cuentas de cobro iniciado',
      });
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Get('estados')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOperation({
    summary: 'Obtener estados de cuenta de cobro',
    description:
      'Obtiene la lista de estados disponibles para cuentas de cobro',
  })
  @ApiOkResponse({
    description: 'Lista de estados obtenida exitosamente',
    type: EstadosCuentaCobroResponseDto,
  })
  obtenerEstados(): EstadosCuentaCobroResponseDto {
    try {
      const estados = this.cuentasCobroService.obtenerEstados();
      return plainToInstance(
        EstadosCuentaCobroResponseDto,
        { estados },
        {
          excludeExtraneousValues: true,
        },
      );
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOperation({
    summary: 'Listar cuentas de cobro',
    description:
      'Obtiene una lista paginada de cuentas de cobro con información del cliente',
  })
  @ApiOkResponse({
    description: 'Lista de cuentas de cobro obtenida exitosamente',
    type: CuentasCobroPaginadasResponseDto,
  })
  async listar(
    @Query() query: PaginadoCuentasCobroRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<CuentasCobroPaginadasResponseDto> {
    try {
      const tenantId = request.tenantId;
      const pagina = query.pagina ?? 1;
      const tamanoPagina = query.tamanoPagina ?? 10;
      const filtro = query.filtro?.trim() || undefined;
      const estado = query.estado;
      const tienePdf = query.tienePdf;
      const siEnvioCorreo = query.siEnvioCorreo;
      const fechaInicio = query.fechaInicio;
      const fechaFin = query.fechaFin;
      const paqueteId = query.paqueteId;

      const resultado: IPaginado<ICuentaCobroListado> =
        await this.cuentasCobroService.listarCuentasCobro(
          tenantId,
          pagina,
          tamanoPagina,
          filtro,
          estado,
          tienePdf,
          siEnvioCorreo,
          fechaInicio,
          fechaFin,
          paqueteId,
        );

      return plainToInstance(CuentasCobroPaginadasResponseDto, resultado, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Get('pagos')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOperation({
    summary: 'Listar pagos',
    description:
      'Obtiene una lista paginada de pagos (cuentas de cobro con estado pagada)',
  })
  @ApiOkResponse({
    description: 'Lista de pagos obtenida exitosamente',
    type: PagosPaginadasResponseDto,
  })
  async listarPagos(
    @Query() query: PaginadoPagosRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<PagosPaginadasResponseDto> {
    try {
      const tenantId = request.tenantId;
      const pagina = query.pagina ?? 1;
      const tamanoPagina = query.tamanoPagina ?? 10;
      const clientePaqueteId = query.clientePaqueteId;

      const resultado = await this.cuentasCobroService.listarPagos(
        tenantId,
        pagina,
        tamanoPagina,
        clientePaqueteId,
      );

      return plainToInstance(PagosPaginadasResponseDto, resultado, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Get(':id/pdf')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOperation({
    summary: 'Descargar PDF de cuenta de cobro',
    description: 'Descarga el PDF de una cuenta de cobro específica por su ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'PDF descargado exitosamente',
    content: {
      'application/pdf': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cuenta de cobro no encontrada o sin PDF generado',
  })
  async descargarPdf(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestConTenant,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const tenantId = request.tenantId;
      const { buffer, nombreArchivo } =
        await this.cuentasCobroService.obtenerPdfCuentaCobro(tenantId, id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${nombreArchivo}"`,
      );
      res.setHeader('Content-Length', buffer.length.toString());

      res.send(buffer);
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Get(':id/pago/pdf')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOperation({
    summary: 'Descargar PDF de recibo de pago',
    description:
      'Descarga el PDF del recibo de pago de una cuenta de cobro específica por su ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'PDF descargado exitosamente',
    content: {
      'application/pdf': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pago no encontrado o sin PDF de recibo generado',
  })
  async descargarPdfPago(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RequestConTenant,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const tenantId = request.tenantId;
      const { buffer, nombreArchivo } =
        await this.cuentasCobroService.obtenerPdfPago(tenantId, id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${nombreArchivo}"`,
      );
      res.setHeader('Content-Length', buffer.length.toString());

      res.send(buffer);
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }
}
