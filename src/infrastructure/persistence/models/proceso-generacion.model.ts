import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  Table,
} from 'sequelize-typescript';
import { EProcesoGeneracion } from '../../../domain/enums/proceso-generacion.enum';
import { EEstadoProceso } from '../../../domain/enums/estado-proceso.enum';

@Table({
  tableName: 'procesos_generacion',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class ProcesoGeneracionModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  declare proceso: EProcesoGeneracion;

  @Default(EEstadoProceso.EN_PROCESO)
  @AllowNull(false)
  @Column({ type: DataType.STRING(20) })
  declare estado: EEstadoProceso;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'dia_proceso' })
  declare diaProceso: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'fecha_inicio' })
  declare fechaInicio: Date;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'fecha_fin' })
  declare fechaFin: Date | null;

  @Default(0)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'procesos_creados' })
  declare procesosCreados: number;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  declare observaciones: string | null;
}
