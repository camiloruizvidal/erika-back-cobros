import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class EstadoCuentaCobroItemDto {
  @ApiProperty({
    description: 'Valor del estado',
    type: String,
    example: 'pendiente',
  })
  @Expose({ name: 'valor' })
  valor!: string;

  @ApiProperty({
    description: 'Etiqueta del estado',
    type: String,
    example: 'Pendiente',
  })
  @Expose({ name: 'etiqueta' })
  etiqueta!: string;
}

export class EstadosCuentaCobroResponseDto {
  @ApiProperty({
    description: 'Lista de estados disponibles para cuentas de cobro',
    type: [EstadoCuentaCobroItemDto],
  })
  @Expose({ name: 'estados' })
  estados!: EstadoCuentaCobroItemDto[];
}

