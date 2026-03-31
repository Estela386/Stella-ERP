"use client";

import { useState } from "react";
import AccountsStats from "./_components/AccountsStats";
import AccountsToolbar from "./_components/AccountsToolbar";
import AccountsTable from "./_components/AccountsTable";
import AccountModal from "./_components/AccountModal";
import PaymentModal from "./_components/PaymentModal";
import ClientModal from "./_components/ClientModal";
import SidebarMenu from "@/app/_components/SideBarMenu";
import { useCuentasPorCobrar } from "@lib/hooks/useCuentasPorCobrar";

export default function AccountsPage() {
  const [openAccount, setOpenAccount] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openClient, setOpenClient] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "paid">("pending");
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const {
    cuentas,
    clientes,
    loading,
    error,
    crearCuentaConCliente,
    crearCuenta,
    registrarPago,
    obtenerPagos,
  } = useCuentasPorCobrar();

  const handleOpenPayment = (id?: number) => {
    setSelectedAccountId(id || null);
    setOpenPayment(true);
  };

  const filteredByTab = cuentas.filter(c => 
    activeTab === "pending" ? c.estado !== "pagado" : c.estado === "pagado"
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f4ef]">
      <SidebarMenu />

      <main className="flex-1 px-3 md:px-8 py-5 md:py-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 md:w-12 bg-[#B76E79]" />
                <span 
                  className="text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] uppercase text-[#B76E79] font-medium"
                  style={{ fontFamily: "var(--font-marcellus)" }}
                >
                  Cuentas por cobrar
                </span>
              </div>
            </div>

            {/* TABS ELEGANTES */}
            <div className="flex w-full lg:w-auto bg-[#8c8976]/10 p-1 rounded-2xl border border-[#8c8976]/20">
              <button
                onClick={() => setActiveTab("pending")}
                className={`flex-1 lg:flex-none px-4 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === "pending"
                    ? "bg-white text-[#b76e79] shadow-sm"
                    : "text-[#708090] hover:bg-white/50"
                }`}
                style={{ fontFamily: "var(--font-marcellus)" }}
              >
                Pendientes
              </button>
              <button
                onClick={() => setActiveTab("paid")}
                className={`flex-1 lg:flex-none px-4 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === "paid"
                    ? "bg-white text-[#708090] shadow-sm"
                    : "text-[#708090] hover:bg-white/50"
                }`}
                style={{ fontFamily: "var(--font-marcellus)" }}
              >
                Pagadas
              </button>
            </div>
          </header>

          <div className="rounded-2xl md:rounded-3xl bg-white p-5 md:p-10 space-y-6 md:space-y-8 border border-[#8c8976]/30 shadow-lg min-h-[500px]">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B76E79]" />
              </div>
            ) : (
              <>
                <AccountsStats cuentas={cuentas} />

                <AccountsToolbar
                  search={search}
                  onSearchChange={setSearch}
                  onAddAccount={() => setOpenAccount(true)}
                  onAddPayment={() => handleOpenPayment()}
                  onAddClient={() => setOpenClient(true)}
                />

                <AccountsTable
                  search={search}
                  cuentas={filteredByTab}
                  onVerPagos={obtenerPagos}
                  onAddPayment={handleOpenPayment}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <PaymentModal
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        cuentas={cuentas}
        selectedCuentaId={selectedAccountId}
        onPago={registrarPago}
      />

      <AccountModal
        open={openAccount}
        onClose={() => setOpenAccount(false)}
        clientes={clientes}
        onGuardar={crearCuenta}
      />

      <ClientModal
        open={openClient}
        onClose={() => setOpenClient(false)}
        onGuardar={crearCuentaConCliente}
      />
    </div>
  );
}
