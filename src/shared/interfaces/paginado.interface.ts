export interface IMetaPaginado {
  total: number;
  pagina: number;
  tamanoPagina: number;
}

export interface IPaginado<T> {
  meta: IMetaPaginado;
  data: T[];
}

