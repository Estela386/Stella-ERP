import { describe, it, expect, vi, beforeEach } from "vitest";
import { PedidoService } from "../lib/services/PedidoService"; // Ajusta tu ruta
import { CreatePedidoDTO } from "../lib/models/Pedido"; // Ajusta tu ruta

describe("Servicio de Pedidos (PedidoService)", () => {
  let mockSupabase: any;
  let pedidoService: PedidoService;
  let mockRepo: any;

  let eqMock: any;
  let singleMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    eqMock = vi.fn();
    singleMock = vi.fn();

    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: eqMock,
    };

    eqMock.mockImplementation((field: string, value: any) => {
      return {
        single: singleMock,
        then: (onFulfilled: any) => {
          if (field === "id_pedido") {
            onFulfilled({ data: [{ id_producto: 10, cantidad: 2 }] });
          } else {
            onFulfilled({ error: null });
          }
        },
      };
    });

    pedidoService = new PedidoService(mockSupabase);

    mockRepo = {
      createPedido: vi.fn(),
      createDetalles: vi.fn(),
    };
    (pedidoService as any).repository = mockRepo;
  });

  it("Debe levantar un pedido exitosamente y guardar sus detalles", async () => {
    const dto: CreatePedidoDTO = {
      id_usuario: 1,
      total_estimado: 1500,
      estado: "PENDIENTE",
      detalles: [
        { id_producto: 10, cantidad: 2, precio_unitario: 500, subtotal: 1000 },
      ],
    };

    mockRepo.createPedido.mockResolvedValue({ data: { id: 99 }, error: null });
    mockRepo.createDetalles.mockResolvedValue({ error: null });

    const result = await pedidoService.levantarPedido(dto);

    expect(result.error).toBeNull();
    expect(result.pedido).toEqual({ id: 99 });
    expect(mockRepo.createPedido).toHaveBeenCalled();
    expect(mockRepo.createDetalles).toHaveBeenCalled();
  });

  it("Debe hacer ROLLBACK (borrar pedido maestro) si los detalles fallan", async () => {
    const dto: CreatePedidoDTO = {
      id_usuario: 1,
      total_estimado: 500,
      estado: "PENDIENTE",
      detalles: [
        { id_producto: 10, cantidad: 1, precio_unitario: 500, subtotal: 500 },
      ],
    };

    mockRepo.createPedido.mockResolvedValue({ data: { id: 99 }, error: null });
    mockRepo.createDetalles.mockResolvedValue({
      error: { message: "Fallo al insertar detalles" },
    });

    const result = await pedidoService.levantarPedido(dto);

    expect(result.pedido).toBeNull();
    expect(result.error).toBeDefined();

    expect(mockSupabase.from).toHaveBeenCalledWith("pedidos");
    expect(mockSupabase.delete).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", 99);
  });

  it("Debe cambiar el estado a PENDIENTE sin descontar inventario", async () => {
    const result = await pedidoService.actualizarEstado(99, "PENDIENTE");

    expect(result.success).toBe(true);
    expect(mockSupabase.from).toHaveBeenCalledWith("pedidos");
    expect(mockSupabase.update).toHaveBeenCalledWith(
      expect.objectContaining({ estado: "PENDIENTE" })
    );
    expect(mockSupabase.select).not.toHaveBeenCalled();
  });

  it("Debe descontar inventario correctamente al pasar a EN_PRODUCCION", async () => {
    singleMock
      .mockResolvedValueOnce({ data: { estado: "PENDIENTE" } })
      .mockResolvedValueOnce({ data: { stock_actual: 5 } });

    const result = await pedidoService.actualizarEstado(99, "EN_PRODUCCION");

    expect(result.success).toBe(true);

    expect(mockSupabase.from).toHaveBeenCalledWith("producto");
    expect(mockSupabase.update).toHaveBeenCalledWith(
      expect.objectContaining({ stock_actual: 3 })
    );

    expect(mockSupabase.update).toHaveBeenCalledWith(
      expect.objectContaining({ estado: "EN_PRODUCCION" })
    );
  });

  it("No debe permitir que el stock quede en negativo (Validación Math.max)", async () => {
    singleMock
      .mockResolvedValueOnce({ data: { estado: "PENDIENTE" } })
      .mockResolvedValueOnce({ data: { stock_actual: 1 } });

    await pedidoService.actualizarEstado(99, "EN_PRODUCCION");

    expect(mockSupabase.update).toHaveBeenCalledWith(
      expect.objectContaining({ stock_actual: 0 })
    );
  });

  it("No debe descontar inventario si el pedido ya estaba en proceso", async () => {
    singleMock.mockResolvedValueOnce({ data: { estado: "ENTREGADO" } });

    await pedidoService.actualizarEstado(99, "EN_PRODUCCION");

    const llamadasUpdate = mockSupabase.update.mock.calls;
    const actualizoProducto = mockSupabase.from.mock.calls.some(
      (call: any) => call[0] === "producto"
    );

    expect(actualizoProducto).toBe(false);
  });
});
