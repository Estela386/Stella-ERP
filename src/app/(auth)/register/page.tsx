import RegisterForm from "./RegisterForm";
import Image from "next/image";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <Image
          src="/logo.png"
          alt="Stella Logo"
          width={96}
          height={96}
          className="h-24 w-24 mb-2"
        />
        <h1 className="font-serif text-5xl text-[#7c5c4a] mb-2">Stella</h1>
      </div>

      {error === "password_mismatch" && (
        <p className="text-red-500">Las contraseñas no coinciden</p>
      )}

      <RegisterForm />
    </>
  );
}
