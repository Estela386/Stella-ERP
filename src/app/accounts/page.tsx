"use client";

import { useState } from "react";
import AccountsStats from "./_components/AccountsStats";
import AccountsToolbar from "./_components/AccountsToolbar";
import AccountsTable from "./_components/AccountsTable";
import AccountModal from "./_components/AccountModal";
import PaymentModal from "./_components/PaymentModal";
import ClientModal from "./_components/ClientModal";
import SidebarMenu from "@/app/_components/SideBarMenu";

export default function AccountsPage() {
  const [openAccount, setOpenAccount] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openClient, setOpenClient] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F3EF]">

      {/* 🧭 SIDEBAR */}
      <SidebarMenu />

      <main className="flex-1 px-4 py-8 overflow-y-auto">

        <div className="mx-auto max-w-6xl space-y-6">

          {/* ===== HEADER IGUAL ===== */}
          <header className="space-y-1">

            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#B76E79]" />
              <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Finanzas
              </span>
            </div>

            <h1
              className="
                font-serif
                text-5xl md:text-6xl
                font-medium
                leading-tight
                text-[#708090]
              "
            >
              Cuentas por cobrar
            </h1>

          </header>

          {/* ===== CARD BLANCA PRINCIPAL ===== */}
          <div
            className="
              relative
              rounded-3xl
              bg-white
              p-10
              space-y-6
              border border-black/10
              shadow-[0_30px_70px_rgba(0,0,0,0.12)]
            "
          >

            {/* 📊 STATS */}
            <AccountsStats />

            {/* 🔎 TOOLBAR */}
            <AccountsToolbar
              onAddAccount={() => setOpenAccount(true)}
              onAddPayment={() => setOpenPayment(true)}
              onAddClient={() => setOpenClient(true)}
            />

            {/* 📋 TABLA */}
            <AccountsTable />

          </div>
        </div>
      </main>

      {/* 🪟 MODALES */}
      <AccountModal
        open={openAccount}
        onClose={() => setOpenAccount(false)}
      />

      <PaymentModal
        open={openPayment}
        onClose={() => setOpenPayment(false)}
      />

      <ClientModal
        open={openClient}
        onClose={() => setOpenClient(false)}
      />

    </div>
  );
}