export interface IMetaPaginado {
  total: number;
  pagina: number;
  tamanoPagina: number;
  totalPaginas: number;
}

export interface IPaginado<T> {
  meta: IMetaPaginado;
  data: T[];
}

