import { describe, it, expect } from "vitest";
import { Usuario } from "../lib/models/Usuario";

describe("Modelo Usuario", () => {
  it("Debe identificar correctamente a un administrador", () => {
    const datosAdmin = {
      id_rol: 1,
      correo: "admin@gmail.com",
      id_auth: "auth123",
      id: "1",
      nombre: "Admin",
      apellido: "Doe",
      created_at: "2024-01-01T00:00:00Z",
    };
    const usuario = new Usuario(datosAdmin);

    expect(usuario.esAdmin()).toBe(true);
    expect(usuario.esMayorista()).toBe(false);
  });

  it("Debe identificar correctamente a un cliente normal", () => {
    const datosCliente = {
      id: "2",
      correo: "cliente@gmail.com",
      id_rol: 2,
      id_auth: "auth456",
      nombre: "Cliente",
      apellido: "Normal",
      created_at: "2024-02-01T00:00:00Z",
    };
    const usuario = new Usuario(datosCliente);

    expect(usuario.esAdmin()).toBe(false);
    expect(usuario.esCliente()).toBe(true);
  });
});
