import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoyaltyService } from "../lib/services/LoyaltyService";

describe("Servicio de Lealtad (LoyaltyService)", () => {
  let mockSupabase: any;
  let loyaltyService: LoyaltyService;

  const nivelesFalsos = [
    { id: 1, name: "Bronce", min_points: 0 },
    { id: 2, name: "Plata", min_points: 100 },
    { id: 3, name: "Oro", min_points: 500 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockSupabase = {
      rpc: vi.fn(),
      from: vi.fn((table: string) => {
        if (table === "loyalty_points") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { points: 50, lifetime_points: 150 },
            }),
          };
        }
        if (table === "user_levels") {
          return {
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: nivelesFalsos }),
          };
        }
        if (table === "loyalty_transactions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({
              data: [{ id: 1, points: 10, type: "compra" }],
            }),
          };
        }
      }),
    };

    loyaltyService = new LoyaltyService(mockSupabase);
  });

  it("Debe calcular correctamente el nivel intermedio (Plata)", async () => {
    const { perfil, error } = await loyaltyService.obtenerPerfilLealtad(1);

    expect(error).toBeNull();
    expect(perfil?.lifetime_points).toBe(150);
    expect(perfil?.nivel_actual?.name).toBe("Plata");
    expect(perfil?.proximo_nivel?.name).toBe("Oro");
  });

  it("Debe identificar cuando se alcanzó el nivel máximo", async () => {
    mockSupabase.from.mockImplementationOnce((table: string) => {
      if (table === "loyalty_points") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { points: 100, lifetime_points: 600 },
          }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: nivelesFalsos }),
      };
    });

    const { perfil } = await loyaltyService.obtenerPerfilLealtad(1);

    expect(perfil?.nivel_actual?.name).toBe("Oro");
    expect(perfil?.proximo_nivel).toBeNull(); // No hay nivel más alto
  });

  it("Debe manejar un usuario nuevo sin registros de puntos previos", async () => {
    mockSupabase.from = vi.fn((table: string) => {
      if (table === "loyalty_points") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
        };
      }
      if (table === "user_levels") {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: nivelesFalsos }),
        };
      }
    });

    const { perfil } = await loyaltyService.obtenerPerfilLealtad(1);

    expect(perfil?.lifetime_points).toBe(0);
    expect(perfil?.points).toBe(0);
    expect(perfil?.nivel_actual?.name).toBe("Bronce");
  });

  it("Debe retornar un error si falla la consulta de niveles", async () => {
    mockSupabase.from = vi.fn((table: string) => {
      if (table === "loyalty_points") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
        };
      }
      if (table === "user_levels") {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: null }),
        };
      }
    });

    const { perfil, error } = await loyaltyService.obtenerPerfilLealtad(1);

    expect(perfil).toBeNull();
    expect(error).toBe("No se encontraron niveles de lealtad");
  });

  it("Debe devolver el historial de transacciones", async () => {
    const historial = await loyaltyService.obtenerHistorial(1);

    expect(historial).toHaveLength(1);
    expect(historial?.[0]?.type).toBe("compra");
    expect(mockSupabase.from).toHaveBeenCalledWith("loyalty_transactions");
  });

  it("Debe otorgar la cantidad correcta de puntos según el monto (1 pto x $10)", async () => {
    mockSupabase.rpc.mockResolvedValue({ error: null });

    const resultado = await loyaltyService.otorgarPuntosPorCompra(1, 255, 99);

    expect(resultado).toBe(true);
    expect(mockSupabase.rpc).toHaveBeenCalledWith("procesar_puntos_lealtad", {
      p_id_usuario: 1,
      p_puntos: 25,
      p_tipo: "compra",
      p_descripcion: "Puntos por pedido #99",
      p_reference_id: 99,
    });
  });

  it("No debe llamar al RPC ni dar puntos si el monto no alcanza ($9)", async () => {
    const resultado = await loyaltyService.otorgarPuntosPorCompra(1, 9, 100);

    expect(resultado).toBe(true);
    expect(mockSupabase.rpc).not.toHaveBeenCalled();
  });

  it("Debe retornar false si el RPC falla en Supabase", async () => {
    mockSupabase.rpc.mockResolvedValue({
      error: { message: "Fallo interno de SQL" },
    });

    const resultado = await loyaltyService.otorgarPuntosPorCompra(1, 100, 101);

    expect(resultado).toBe(false);
  });
});
