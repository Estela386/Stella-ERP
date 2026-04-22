"use client";

import { use } from "react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import ProductPageContainer from "../../_components/ProductPageContainer";

export default function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  // Desenvuelve params
  const { id } = use(params);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--beige)" }}>
      <SidebarMenu />

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto" style={{ background: "var(--beige)" }}>
        <div className="mx-auto max-w-[1440px] space-y-8">
          <ProductPageContainer productoId={Number(id)} />
        </div>
      </main>
    </div>
  );
}
