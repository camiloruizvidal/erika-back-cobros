import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginadoResponseDto } from './paginado.response.dto';
import { CuentaCobroListadoResponseDto } from './cuenta-cobro-listado.response.dto';

export class CuentasCobroPaginadasResponseDto extends PaginadoResponseDto<CuentaCobroListadoResponseDto> {
  @ApiProperty({ isArray: true, type: () => CuentaCobroListadoResponseDto })
  @Expose({ name: 'data' })
  @Type(() => CuentaCobroListadoResponseDto)
  declare data: CuentaCobroListadoResponseDto[];
}
