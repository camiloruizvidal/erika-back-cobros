import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginadoResponseDto } from './paginado.response.dto';
import { PagoListadoResponseDto } from './pago-listado.response.dto';

export class PagosPaginadasResponseDto extends PaginadoResponseDto<PagoListadoResponseDto> {
  @ApiProperty({ isArray: true, type: () => PagoListadoResponseDto })
  @Expose({ name: 'data' })
  @Type(() => PagoListadoResponseDto)
  declare data: PagoListadoResponseDto[];
}

