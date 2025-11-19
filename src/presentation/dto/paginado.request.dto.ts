import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { TransformadoresDto } from '../utils/transformadores-dto.helper';

export class PaginadoRequestDto {
  @ApiPropertyOptional({
    description: 'Número de página (inicia en 1)',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsInt({ message: 'pagina debe ser un número entero' })
  @Min(1, { message: 'pagina debe ser mayor o igual a 1' })
  @Expose({ name: 'pagina' })
  pagina?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página',
    type: Number,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsInt({ message: 'tamano_pagina debe ser un número entero' })
  @Min(1, { message: 'tamano_pagina debe ser mayor o igual a 1' })
  @Expose({ name: 'tamano_pagina' })
  tamanoPagina?: number;
}
