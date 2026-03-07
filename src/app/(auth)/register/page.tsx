import RegisterForm from "./_components/RegisterForm";
import ResetLayout from "@/app/resetPass/_components/ResetLayout";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <ResetLayout>
      <div className="w-full max-w-md space-y-4">
        {error === "password_mismatch" && (
          <p className="text-[#B76E79] text-center">
            Las contraseñas no coinciden
          </p>
        )}

        <RegisterForm />
      </div>
    </ResetLayout>
  );
}
