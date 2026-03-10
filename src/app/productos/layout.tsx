export const metadata = {
  title: "Productos | Stella",
  description: "Catálogo de productos",
};
import { Toaster } from "sonner";

export default function ProductosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
