import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ClientePaqueteServicioModel } from './cliente-paquete-servicio.model';
import { EEstado } from '../../../domain/enums/estado.enum';
import { EFrecuenciaTipo } from '../../../domain/enums/frecuencia-tipo.enum';

@Table({
  tableName: 'cliente_paquetes',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class ClientePaqueteModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'tenant_id' })
  declare tenantId: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'cliente_id' })
  declare clienteId: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'paquete_original_id' })
  declare paqueteOriginalId: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(150), field: 'nombre_paquete' })
  declare nombrePaquete: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: 'valor_acordado',
  })
  declare valorAcordado: number;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER, field: 'dia_cobro' })
  declare diaCobro: number | null;

  @AllowNull(false)
  @Column({ type: DataType.STRING(20), field: 'frecuencia_tipo' })
  declare frecuenciaTipo: EFrecuenciaTipo;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER, field: 'frecuencia_valor' })
  declare frecuenciaValor: number | null;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'fecha_inicio' })
  declare fechaInicio: Date;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'fecha_fin' })
  declare fechaFin: Date | null;

  @Default(EEstado.ACTIVO)
  @AllowNull(false)
  @Column({ type: DataType.STRING(20) })
  declare estado: EEstado;

  @HasMany(() => ClientePaqueteServicioModel, 'cliente_paquete_id')
  servicios?: ClientePaqueteServicioModel[];
}
