export interface IGeneracionCuentasCobroIniciada {
  fechaObjetivo: string;
  timestamp: string;
}

export interface IGeneracionCuentasCobroCompletada {
  fechaCobro: string;
  cantidadGenerada: number;
  timestamp: string;
}
