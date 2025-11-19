import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class PagoListadoResponseDto {
  @ApiProperty({
    description: 'Identificador del pago (cuenta de cobro)',
    type: Number,
  })
  @Expose({ name: 'id' })
  id!: number;

  @ApiProperty({ description: 'Identificador del cliente', type: Number })
  @Expose({ name: 'clienteId' })
  cliente_id!: number;

  @ApiProperty({ description: 'Nombre completo del cliente', type: String })
  @Expose({ name: 'nombreCliente' })
  nombre_cliente!: string;

  @ApiProperty({ description: 'Correo electrónico del cliente', type: String })
  @Expose({ name: 'correoCliente' })
  correo_cliente!: string;

  @ApiProperty({
    description: 'Documento de identificación del cliente',
    type: String,
    nullable: true,
  })
  @Expose({ name: 'identificacionCliente' })
  identificacion_cliente!: string | null;

  @ApiProperty({ description: 'Fecha de cobro', type: Date })
  @Expose({ name: 'fechaCobro' })
  fecha_cobro!: Date;

  @ApiProperty({
    description: 'Valor total de la cuenta de cobro',
    type: Number,
  })
  @Expose({ name: 'valorTotal' })
  valor_total!: number;

  @ApiProperty({
    description: 'Fecha de pago',
    type: Date,
    nullable: true,
  })
  @Expose({ name: 'fechaPago' })
  fecha_pago!: Date | null;

  @ApiProperty({
    description: 'Valor pagado',
    type: Number,
    nullable: true,
  })
  @Expose({ name: 'valorPagado' })
  valor_pagado!: number | null;

  @ApiProperty({
    description: 'Indica si se generó el PDF del recibo de pago',
    type: Boolean,
  })
  @Expose({ name: 'tienePdfPago' })
  tiene_pdf_pago!: boolean;
}
