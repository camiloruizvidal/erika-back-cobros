import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CuentaCobroListadoResponseDto {
  @ApiProperty({
    description: 'Identificador de la cuenta de cobro',
    type: Number,
  })
  @Transform(({ obj }) => Number(obj.id))
  @Expose({ name: 'id' })
  id!: number;

  @ApiProperty({ description: 'Identificador del cliente', type: Number })
  @Transform(({ obj }) => Number(obj.clienteId))
  @Expose({ name: 'clienteId' })
  cliente_id!: number;

  @ApiProperty({ description: 'Nombre completo del cliente', type: String })
  @Transform(({ obj }) => obj.cliente?.nombreCompleto || '')
  @Expose({ name: 'nombreCliente' })
  nombre_cliente!: string;

  @ApiProperty({ description: 'Correo electrónico del cliente', type: String })
  @Transform(({ obj }) => obj.cliente?.correo || '')
  @Expose({ name: 'correoCliente' })
  correo_cliente!: string;

  @ApiProperty({
    description: 'Documento de identificación del cliente',
    type: String,
    nullable: true,
  })
  @Transform(({ obj }) => obj.cliente?.identificacion || null)
  @Expose({ name: 'identificacionCliente' })
  identificacion_cliente!: string | null;

  @ApiProperty({ description: 'Fecha de cobro', type: Date })
  @Transform(({ obj }) => obj.fechaCobro)
  @Expose({ name: 'fechaCobro' })
  fecha_cobro!: Date;

  @ApiProperty({
    description: 'Valor total de la cuenta de cobro',
    type: Number,
  })
  @Transform(({ obj }) => Number(obj.valorTotal))
  @Expose({ name: 'valorTotal' })
  valor_total!: number;

  @ApiProperty({ description: 'Estado de la cuenta de cobro', type: String })
  @Transform(({ obj }) => obj.estado)
  @Expose({ name: 'estado' })
  estado!: string;

  @ApiProperty({ description: 'Indica si se generó el PDF', type: Boolean })
  @Transform(({ obj }) => obj.urlPdf !== null)
  @Expose({ name: 'tienePdf' })
  tiene_pdf!: boolean;

  @ApiProperty({ description: 'Indica si se envió el correo', type: Boolean })
  @Transform(({ obj }) => obj.siEnvioCorreo)
  @Expose({ name: 'siEnvioCorreo' })
  si_envio_correo!: boolean;

  @ApiProperty({
    description: 'Fecha de envío del correo',
    type: Date,
    nullable: true,
  })
  @Transform(({ obj }) => obj.fechaEnvioCorreo)
  @Expose({ name: 'fechaEnvioCorreo' })
  fecha_envio_correo!: Date | null;
}
