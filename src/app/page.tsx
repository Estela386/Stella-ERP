"use client";
import Image from "next/image";
import PrimaryButton from "@/_components/PrimaryButton";
import { useRouter } from "next/navigation";
export default function HomePage() {
  const router = useRouter();
  return (
    <main className="mx-auto flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="">
        <Image src="/logo.png" alt="Stella Logo" width={200} height={200} />
        <PrimaryButton className="mt-6" onClick={() => router.push("/login") }>
          Inicia sesión
        </PrimaryButton>
      </div>
    </main>
  );
}
