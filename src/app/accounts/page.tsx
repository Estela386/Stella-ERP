"use client";

import { useState } from "react";
import AccountsStats from "./_components/AccountsStats";
import AccountsToolbar from "./_components/AccountsToolbar";
import AccountsTable from "./_components/AccountsTable";
import AccountModal from "./_components/AccountModal";
import PaymentModal from "./_components/PaymentModal";
import ClientModal from "./_components/ClientModal";
import SidebarMenu from "@/app/_components/SideBarMenu";

export type Account = {
  id: number;
  cliente: string;
  concepto: string;
  monto: number;
  pagado: number;
  activo: boolean;
};

export default function AccountsPage() {
  const [openAccount, setOpenAccount] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openClient, setOpenClient] = useState(false);
  const [search, setSearch] = useState("");

  // 🔥 ESTADO GLOBAL
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: 1,
      cliente: "María López",
      concepto: "Venta de productos",
      monto: 3000,
      pagado: 1000,
      activo: true,
    },
    {
      id: 2,
      cliente: "Carlos Ramírez",
      concepto: "Servicio mensual",
      monto: 5000,
      pagado: 5000,
      activo: true,
    },
  ]);

  return (
    <div className="flex min-h-screen bg-[#f6f4ef]">
      <SidebarMenu />

      <main className="flex-1 px-4 md:px-8 py-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-8">

          <header className="space-y-3">
            <h1 className="text-5xl font-medium text-[#708090]">
              Cuentas por cobrar
            </h1>
          </header>

          <div className="rounded-3xl bg-white p-10 space-y-8 border border-[#8c8976]/30 shadow-lg">

            <AccountsStats accounts={accounts} />

            <AccountsToolbar
              search={search}
              onSearchChange={setSearch}
              onAddAccount={() => setOpenAccount(true)}
              onAddPayment={() => setOpenPayment(true)}
              onAddClient={() => setOpenClient(true)}
            />

            <AccountsTable search={search} accounts={accounts} />
          </div>
        </div>
      </main>

      <PaymentModal
        open={openPayment}
        onClose={() => setOpenPayment(false)}
        accounts={accounts}
        setAccounts={setAccounts}
      />

      <AccountModal open={openAccount} onClose={() => setOpenAccount(false)} />
      <ClientModal open={openClient} onClose={() => setOpenClient(false)} />
    </div>
  );
}