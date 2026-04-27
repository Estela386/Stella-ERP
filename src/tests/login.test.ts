import { describe, it, expect, vi, beforeEach } from "vitest";
import { login } from "../app/(auth)/actions";
import { redirect } from "next/navigation";
import * as supabaseServer from "@/utils/supabase/server";
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Server Action: login", () => {
  let mockSignInWithPassword: any;
  let mockSingle: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSignInWithPassword = vi.fn();
    mockSingle = vi.fn();
    // Se usa un supabase simulado para controlar las respuestas de autenticación y consulta de roles
    const mockSupabase = {
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: mockSingle,
    };
    (supabaseServer.createClient as any).mockResolvedValue(mockSupabase);
  });

  const crearFormData = (email: string, password: string) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    return formData;
  };

  it("Debe rechazar credenciales incorrectas o usuario inexistente", async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: "Invalid credentials" },
    });

    const formData = crearFormData("test@stella.com", "claveMala");
    const resultado = await login(null, formData);

    expect(resultado).toEqual({
      success: false,
      message: "Correo o contraseña incorrectos",
    });
    expect(mockSingle).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("Debe redirigir al Admin (id_rol: 1) a /dashboard/inicio", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    mockSingle.mockResolvedValue({ data: { id_rol: 1 }, error: null });

    const formData = crearFormData("admin@stella.com", "clave123");
    await login(null, formData);

    expect(redirect).toHaveBeenCalledWith("/dashboard/inicio");
  });

  it("Debe redirigir al Cliente (id_rol: 2) a /dashboard/cliente", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    mockSingle.mockResolvedValue({ data: { id_rol: 2 }, error: null });

    const formData = crearFormData("cliente@stella.com", "clave123");
    await login(null, formData);

    expect(redirect).toHaveBeenCalledWith("/dashboard/cliente");
  });

  it("Debe redirigir al Mayorista (id_rol: 3) a /dashboard/cliente", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    mockSingle.mockResolvedValue({ data: { id_rol: 3 }, error: null });

    const formData = crearFormData("mayorista@stella.com", "clave123");
    await login(null, formData);

    expect(redirect).toHaveBeenCalledWith("/dashboard/cliente");
  });

  it("Debe redirigir a /dashboard/cliente por defecto si falla la consulta del rol", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "Table error" },
    });

    const formData = crearFormData("raro@stella.com", "clave123");
    await login(null, formData);

    expect(redirect).toHaveBeenCalledWith("/dashboard/cliente");
  });
});
