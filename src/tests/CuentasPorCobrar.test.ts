import { describe, it, expect, vi, beforeEach } from "vitest";
import { CuentasPorCobrarService } from "../lib/services/CuentasPorCobrarService";
describe("Servicio de Cuentas por Cobrar", () => {
  let mockSupabase: any;
  let service: CuentasPorCobrarService;
  let mockRepo: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = {} as any;
    service = new CuentasPorCobrarService(mockSupabase);

    mockRepo = {
      crear: vi.fn(),
      createPago: vi.fn(),
      obtenerPorId: vi.fn(),
      actualizar: vi.fn(),
      obtenerPorCliente: vi.fn(),
    };

    (service as any).repository = mockRepo;
  });

  it("Debe crear una cuenta desde cero (crear) con estado pendiente y cero pagado", async () => {
    mockRepo.crear.mockResolvedValue({ data: { id: 1 } });

    await service.crear(1, "Deuda inicial", 1000);
    expect(mockRepo.crear).toHaveBeenCalledWith(
      expect.objectContaining({
        monto_inicial: 1000,
        monto_pagado: 0,
        monto_pendiente: 1000,
        estado: "pendiente",
      })
    );
  });

  it('Debe crearParaVenta con estado "pagado" si el pago inicial cubre el total', async () => {
    mockRepo.crear.mockResolvedValue({ data: { id: 2 } });
    mockRepo.createPago.mockResolvedValue({ data: { id: 99 }, error: null });

    await service.crearParaVenta(1, 10, 500, 500, "Compra de anillos");

    expect(mockRepo.crear).toHaveBeenCalledWith(
      expect.objectContaining({
        monto_pendiente: 0,
        estado: "pagado",
      })
    );
    expect(mockRepo.createPago).toHaveBeenCalled();
  });

  it('Debe crearParaVenta con estado "pendiente" si el pago inicial es menor', async () => {
    mockRepo.crear.mockResolvedValue({ data: { id: 2 } });
    mockRepo.createPago.mockResolvedValue({ data: { id: 99 }, error: null });

    await service.crearParaVenta(1, 10, 1000, 200, "Compra a crédito");

    expect(mockRepo.crear).toHaveBeenCalledWith(
      expect.objectContaining({
        monto_pendiente: 800,
        estado: "pendiente",
      })
    );
  });

  it("Debe rechazar un pago menor o igual a 0", async () => {
    mockRepo.obtenerPorId.mockResolvedValue({ data: { monto_pendiente: 500 } });

    const result = await service.registrarPago(1, 0, "Efectivo");

    expect(result.error).toBe("El monto debe ser mayor a 0");
    expect(mockRepo.createPago).not.toHaveBeenCalled();
  });

  it("Debe rechazar un pago que exceda el saldo pendiente", async () => {
    mockRepo.obtenerPorId.mockResolvedValue({ data: { monto_pendiente: 300 } });

    const result = await service.registrarPago(1, 500, "Transferencia");

    expect(result.error).toBe("El monto excede el saldo pendiente");
  });

  it("Debe rechazar si la cuenta no existe", async () => {
    mockRepo.obtenerPorId.mockResolvedValue(null);

    const result = await service.registrarPago(999, 100, "Efectivo");
    expect(result.error).toBe("Cuenta no encontrada");
  });

  it('Debe actualizar los saldos y cambiar estado a "parcial" tras un abono válido', async () => {
    mockRepo.obtenerPorId.mockResolvedValue({
      data: { monto_pendiente: 1000, monto_pagado: 200 },
    });
    mockRepo.createPago.mockResolvedValue({ data: { id: 1 }, error: null });
    mockRepo.actualizar.mockResolvedValue({ data: { id: 1 } });

    await service.registrarPago(1, 300, "Efectivo");

    expect(mockRepo.actualizar).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        monto_pagado: 500,
        monto_pendiente: 700,
        estado: "parcial",
      })
    );
  });

  it('Debe cambiar el estado a "pagado" cuando el abono liquida la deuda', async () => {
    mockRepo.obtenerPorId.mockResolvedValue({
      data: { monto_pendiente: 400, monto_pagado: 600 },
    });
    mockRepo.createPago.mockResolvedValue({ data: { id: 1 }, error: null });
    mockRepo.actualizar.mockResolvedValue({ data: { id: 1 } });

    await service.registrarPago(1, 400, "Efectivo");

    expect(mockRepo.actualizar).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        monto_pagado: 1000,
        monto_pendiente: 0,
        estado: "pagado",
      })
    );
  });

  it("Debe calcular correctamente el resumen financiero de un cliente", async () => {
    const cuentasFalsas = [
      {
        data: { monto_inicial: 1000, monto_pagado: 500, monto_pendiente: 500 },
      },
      { data: { monto_inicial: 500, monto_pagado: 500, monto_pendiente: 0 } },
    ];

    mockRepo.obtenerPorCliente.mockResolvedValue(cuentasFalsas);

    const resumen = await service.obtenerResumenCliente(1);

    expect(resumen.totalCuentas).toBe(2);
    expect(resumen.totalPendiente).toBe(500);
    expect(resumen.totalPagado).toBe(1000);
    expect(resumen.porcentajePagado).toBeCloseTo(66.66, 1);
  });
});
