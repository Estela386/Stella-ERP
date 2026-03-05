"use client";

interface Props {
  search: string;
}

export default function AccountsTable({ search }: Props) {
  // 🔹 Datos simulados (luego pueden venir de Supabase)
  const accounts = [
    {
      cliente: "María López",
      concepto: "Venta de productos",
      monto: 3000,
      pagado: 1000,
    },
    {
      cliente: "Carlos Ramírez",
      concepto: "Servicio mensual",
      monto: 5000,
      pagado: 5000,
    },
  ];

  // 🔎 FILTRO
  const filteredAccounts = accounts.filter(
    account =>
      account.cliente.toLowerCase().includes(search.toLowerCase()) ||
      account.concepto.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* ===== SI NO HAY RESULTADOS ===== */}
      {filteredAccounts.length === 0 && (
        <div className="text-center py-10 text-[#708090]">
          No se encontraron resultados
        </div>
      )}

      {/* ===== DESKTOP TABLE ===== */}
      {filteredAccounts.length > 0 && (
        <>
          <div className="hidden md:block bg-[#f6f4ef] rounded-2xl shadow-[0_20px_60px_rgba(140,137,118,0.35)] overflow-hidden border border-[#8c8976]/30">
            <table className="w-full text-left">
              <thead className="bg-[#708090]">
                <tr>
                  <th className="p-4 text-[#f6f4ef] font-semibold">Cliente</th>
                  <th className="text-[#f6f4ef] font-semibold">Concepto</th>
                  <th className="text-[#f6f4ef] font-semibold">Monto</th>
                  <th className="text-[#f6f4ef] font-semibold">Pagado</th>
                  <th className="text-[#f6f4ef] font-semibold">Pendiente</th>
                  <th className="text-[#f6f4ef] font-semibold">Estado</th>
                </tr>
              </thead>

              <tbody className="text-[#708090]">
                {filteredAccounts.map((account, index) => {
                  const pendiente = account.monto - account.pagado;
                  const pagadoCompleto = pendiente === 0;

                  return (
                    <tr
                      key={index}
                      className="border-t border-[#8c8976]/30 hover:bg-[#8c8976]/10 transition"
                    >
                      <td className="p-4 font-medium">{account.cliente}</td>
                      <td>{account.concepto}</td>
                      <td>$ {account.monto.toLocaleString()}</td>
                      <td className="text-[#b76e79] font-semibold">
                        $ {account.pagado.toLocaleString()}
                      </td>
                      <td className="font-semibold">
                        $ {pendiente.toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            pagadoCompleto
                              ? "bg-[#708090] text-[#f6f4ef]"
                              : "bg-[#b76e79] text-[#f6f4ef]"
                          }`}
                        >
                          {pagadoCompleto ? "Pagado" : "Pendiente"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="md:hidden space-y-4">
            {filteredAccounts.map((account, index) => {
              const pendiente = account.monto - account.pagado;
              const pagadoCompleto = pendiente === 0;

              return (
                <div
                  key={index}
                  className="bg-[#f6f4ef] p-5 rounded-2xl border border-[#8c8976]/30 shadow-[0_15px_40px_rgba(140,137,118,0.3)]"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-[#708090]">
                      {account.cliente}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pagadoCompleto
                          ? "bg-[#708090] text-[#f6f4ef]"
                          : "bg-[#b76e79] text-[#f6f4ef]"
                      }`}
                    >
                      {pagadoCompleto ? "Pagado" : "Pendiente"}
                    </span>
                  </div>

                  <p className="text-sm text-[#8c8976] mt-2">
                    {account.concepto}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-[#8c8976]">Monto</p>
                      <p className="font-semibold text-[#708090]">
                        $ {account.monto.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#8c8976]">Pagado</p>
                      <p className="font-semibold text-[#b76e79]">
                        $ {account.pagado.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#8c8976]">Pendiente</p>
                      <p className="font-semibold text-[#708090]">
                        $ {pendiente.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
