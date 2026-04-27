import { describe, it, expect, beforeEach } from "vitest";
import { Producto, IProducto } from "../lib/models/Producto";
describe("Modelo Producto", () => {
  let baseData: IProducto;

  beforeEach(() => {
    baseData = {
      id: 1,
      nombre: "Anillo de Diamante",
      costo: 1000,
      precio: 1500,
      tiempo: null,
      stock_actual: 10,
      stock_min: 5,
      url_imagen: null,
      id_categoria: 1,
      tipo: "fabricado",
      activo: true,
    };
  });

  it("Debe inicializarse con los valores por defecto correctos si faltan datos", () => {
    const dataIncompleta = {
      id: 2,
      nombre: "Collar",
      precio: 500,
    } as IProducto;
    const producto = new Producto(dataIncompleta);

    expect(producto.tipo).toBe("fabricado");
    expect(producto.activo).toBe(true);
    expect(producto.iva).toBe(0);
    expect(producto.imagenes).toEqual([]);
    expect(producto.url_filtro_tiktok).toBeNull();
  });

  it("Debe calcular el margen de ganancia correctamente", () => {
    const producto = new Producto(baseData);
    expect(producto.calcularMargen()).toBe(50);
  });

  it("Debe devolver null si falta el costo o el precio", () => {
    const sinCosto = new Producto({ ...baseData, costo: null });
    const sinPrecio = new Producto({ ...baseData, precio: 0 });
    expect(sinCosto.calcularMargen()).toBeNull();
    expect(sinPrecio.calcularMargen()).toBeNull();
  });

  it("Debe detectar correctamente si el stock está bajo", () => {
    const productoBajo = new Producto({
      ...baseData,
      stock_actual: 4,
      stock_min: 5,
    });
    expect(productoBajo.esStockBajo()).toBe(true);
  });

  it("No debe reportar stock bajo si hay suficiente inventario", () => {
    const productoNormal = new Producto({
      ...baseData,
      stock_actual: 10,
      stock_min: 5,
    });
    expect(productoNormal.esStockBajo()).toBe(false);
  });

  it("Debe devolver false si la configuración de stock está incompleta", () => {
    const sinStockActual = new Producto({ ...baseData, stock_actual: null });
    const sinStockMinimo = new Producto({ ...baseData, stock_min: null });

    expect(sinStockActual.esStockBajo()).toBe(false);
    expect(sinStockMinimo.esStockBajo()).toBe(false);
  });

  it("Debe pasar la validación si todos los datos son correctos", () => {
    const producto = new Producto(baseData);
    const resultado = producto.validar();
    expect(resultado.valid).toBe(true);
    expect(resultado.errors).toHaveLength(0);
  });

  it("Debe fallar si el nombre está vacío o es nulo", () => {
    const sinNombre = new Producto({ ...baseData, nombre: "" });
    const nombreEspacios = new Producto({ ...baseData, nombre: "   " });
    expect(sinNombre.validar().valid).toBe(false);
    expect(sinNombre.validar().errors).toContain(
      "El nombre del producto es requerido"
    );
    expect(nombreEspacios.validar().valid).toBe(false);
  });
  it("Debe fallar si hay valores numéricos negativos (costo, precio, stock)", () => {
    const productoNegativo = new Producto({
      ...baseData,
      costo: -100,
      precio: -50,
      stock_actual: -5,
    });
    const resultado = productoNegativo.validar();
    expect(resultado.valid).toBe(false);
    expect(resultado.errors).toHaveLength(3);
    expect(resultado.errors).toContain("El costo no puede ser negativo");
    expect(resultado.errors).toContain("El precio no puede ser negativo");
    expect(resultado.errors).toContain("El stock actual no puede ser negativo");
  });

  it("Debe generar una representación JSON limpia del producto", () => {
    const producto = new Producto(baseData);
    const json = producto.toJSON();
    expect(json.id).toBe(1);
    expect(json.nombre).toBe("Anillo de Diamante");
    expect(json.activo).toBe(true);
    expect(json).not.toHaveProperty("calcularMargen");
    expect(json).not.toHaveProperty("validar");
  });
});
