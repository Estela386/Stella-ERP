import { Suspense } from "react";
import HomeClient from "./_components/HomeClient";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <HomeClient />
    </Suspense>
  );
}
