import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsIn,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { PaginadoRequestDto } from './paginado.request.dto';
import { EEstadoCuentaCobro } from '../../domain/enums/estado-cuenta-cobro.enum';

export class PaginadoCuentasCobroRequestDto extends PaginadoRequestDto {
  @ApiPropertyOptional({
    description:
      'Filtro para buscar por nombre del cliente o número de documento',
    type: String,
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString({ message: 'filtro debe ser una cadena de texto' })
  @Expose({ name: 'filtro' })
  filtro?: string;

  @ApiPropertyOptional({
    description: 'Filtro por estado de la cuenta de cobro',
    enum: EEstadoCuentaCobro,
    example: EEstadoCuentaCobro.PENDIENTE,
  })
  @IsOptional()
  @IsEnum(EEstadoCuentaCobro, {
    message: 'estado debe ser uno de: pendiente, pagada, mora, cancelada',
  })
  @Expose({ name: 'estado' })
  estado?: EEstadoCuentaCobro;

  @ApiPropertyOptional({
    description:
      'Filtro por si tiene PDF generado (true, false, o null para todos)',
    type: String,
    example: 'true',
  })
  @IsOptional()
  @IsIn(['true', 'false', 'all'], {
    message: 'tiene_pdf debe ser: true, false o all',
  })
  @Expose({ name: 'tiene_pdf' })
  tienePdf?: string;

  @ApiPropertyOptional({
    description:
      'Filtro por si se envió correo (true, false, o null para todos)',
    type: String,
    example: 'true',
  })
  @IsOptional()
  @IsIn(['true', 'false', 'all'], {
    message: 'si_envio_correo debe ser: true, false o all',
  })
  @Expose({ name: 'si_envio_correo' })
  siEnvioCorreo?: string;

  @ApiPropertyOptional({
    description: 'Fecha de inicio para filtrar (formato YYYY-MM-DD)',
    type: String,
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'fecha_inicio debe ser una fecha válida en formato YYYY-MM-DD' },
  )
  @Expose({ name: 'fecha_inicio' })
  fechaInicio?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin para filtrar (formato YYYY-MM-DD)',
    type: String,
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'fecha_fin debe ser una fecha válida en formato YYYY-MM-DD' },
  )
  @Expose({ name: 'fecha_fin' })
  fechaFin?: string;

  @ApiPropertyOptional({
    description: 'Filtro por ID del paquete original',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Expose({ name: 'paquete_id' })
  paqueteId?: number;
}
