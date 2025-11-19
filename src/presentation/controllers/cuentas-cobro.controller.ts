import { Controller, Post, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CuentasCobroService } from '../../application/services/cuentas-cobro.service';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';
import { GenerarCuentasCobroResponseDto } from '../dto/generar-cuentas-cobro.response.dto';

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
}
