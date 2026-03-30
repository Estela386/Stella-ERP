export interface IProductoOpcionValor {
  id: number;
  opcion_id: number;
  valor: string;
  stock: number;
  extra?: any;
}

export class ProductoOpcionValor {
  constructor(public data: IProductoOpcionValor) {}
}
