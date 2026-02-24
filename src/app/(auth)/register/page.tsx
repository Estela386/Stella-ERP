import RegisterForm from "./_components/RegisterForm";
import Image from "next/image";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <div className="flex flex-col items-center mb-2">
        <Image
          src="/logo.png"
          alt="Stella Logo"
          width={96}
          height={96}
          className="h-24 w-24 mb-2"
        />
      </div>

      {error === "password_mismatch" && (
        <p className="text-red-500">Las contraseñas no coinciden</p>
      )}

      <RegisterForm />
    </>
  );
}
