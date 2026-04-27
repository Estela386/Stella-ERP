// validaciones.test.ts
import { describe, it, expect } from "vitest";
import { validateEmail, validateRequired } from "../app/(auth)/actions";
describe("Validaciones Generales", () => {
  it("Debe rechazar un formato de correo incorrecto", () => {
    expect(validateEmail("correo-invalido")).toBe(false);
    expect(validateEmail("usuario@.com")).toBe(false);
  });

  it("Debe aceptar un formato de correo válido", () => {
    expect(validateEmail("cliente@stella.com")).toBe(true);
  });

  it("Debe fallar si un campo obligatorio está vacío", () => {
    expect(validateRequired("")).toBe(false);
    expect(validateRequired("   ")).toBe(false);
  });
});
