import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { PaginadoRequestDto } from './paginado.request.dto';

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
}
