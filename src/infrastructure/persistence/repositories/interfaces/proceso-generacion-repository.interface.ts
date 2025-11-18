import { EProcesoGeneracion } from '../../../../domain/enums/proceso-generacion.enum';
import { EEstadoProceso } from '../../../../domain/enums/estado-proceso.enum';

export interface ICrearProcesoGeneracion {
  proceso: EProcesoGeneracion;
  diaProceso: number;
}

export interface IActualizarProcesoGeneracion {
  estado: EEstadoProceso;
  fechaFin: Date;
  procesosCreados: number;
  observaciones?: string | null;
}

