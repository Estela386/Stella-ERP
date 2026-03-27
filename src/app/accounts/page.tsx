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

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f4ef]">
      <SidebarMenu />

      <main className="flex-1 px-4 md:px-8 py-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#B76E79]" />
              <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Finanzas
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-medium leading-tight text-[#708090]">
              Cuentas por Cobrar
            </h1>
          </header>

          <div className="rounded-3xl bg-white p-10 space-y-8 border border-[#8c8976]/30 shadow-lg">
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
                  onAddPayment={() => setOpenPayment(true)}
                  onAddClient={() => setOpenClient(true)}
                />

                <AccountsTable
                  search={search}
                  cuentas={cuentas}
                  onVerPagos={obtenerPagos}
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
