// app/productos/[id]/page.tsx

import ProductoClient from "./ProductoClient";

interface ProductoPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { id } = await params;
  return <ProductoClient id={id} />;
}
