import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { PaginadoRequestDto } from './paginado.request.dto';
import { TransformadoresDto } from '../utils/transformadores-dto.helper';

export class PaginadoPagosRequestDto extends PaginadoRequestDto {
  @ApiProperty({
    description: 'ID del paquete cliente (cliente_paquete_id)',
    type: Number,
    example: 1,
  })
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsNumber({}, { message: 'cliente_paquete_id debe ser un número' })
  @Expose({ name: 'cliente_paquete_id' })
  clientePaqueteId!: number;
}

