import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'clientes',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class ClienteModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'tenant_id' })
  tenantId!: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'tipo_documento_id' })
  tipoDocumentoId!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100), field: 'primer_nombre' })
  primerNombre!: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(100), field: 'segundo_nombre' })
  segundoNombre!: string | null;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100), field: 'primer_apellido' })
  primerApellido!: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(100), field: 'segundo_apellido' })
  segundoApellido!: string | null;

  @AllowNull(false)
  @Column({ type: DataType.STRING(400), field: 'nombre_completo' })
  nombreCompleto!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(150) })
  correo!: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(20) })
  telefono!: string | null;

  @AllowNull(true)
  @Column({ type: DataType.STRING(50) })
  identificacion!: string | null;
}
