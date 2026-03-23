export interface IProductoOpcionValor {
  id: number;
  opcion_id: number;
  valor: string;
  extra?: any;
}

export class ProductoOpcionValor {
  constructor(public data: IProductoOpcionValor) {}
}
