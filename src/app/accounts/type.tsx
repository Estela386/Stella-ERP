export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
}

export interface CuentaPorCobrar {
  id: number;
  cliente: string;
  concepto: string;
  monto_inicial: number;
  monto_pagado: number;
  monto_pendiente: number;
  estado: string;
}

export interface Pago {
  id: number;
  monto_pago: number;
  metodo_pago: string;
  fecha_pago: string;
}