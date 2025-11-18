import { EEstadoCuentaCobro } from '../../../../domain/enums/estado-cuenta-cobro.enum';

export interface ICrearCuentaCobro {
  tenantId: number;
  clienteId: number;
  clientePaqueteId: number;
  fechaCobro: Date;
  valorTotal: number;
  valorPaquete: number;
  valorConceptosAdicionales: number;
  estado: EEstadoCuentaCobro;
  observaciones?: string | null;
}

export interface ICuentaCobro {
  id: number;
  tenantId: number;
  clienteId: number;
  clientePaqueteId: number;
  fechaCobro: Date;
  valorTotal: number;
  valorPaquete: number;
  valorConceptosAdicionales: number;
  estado: string;
  urlPdf: string | null;
  siEnvioCorreo: boolean;
  fechaEnvioCorreo: Date | null;
  observaciones: string | null;
}

export interface ICrearCuentaCobroServicio {
  cuentaCobroId: number;
  clientePaqueteServicioId: number;
  nombreServicio: string;
  valorOriginal: number;
  valorAcordado: number;
}

