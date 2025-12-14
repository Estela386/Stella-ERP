import LoginForm from "./_components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center mb-8">
        <Image
          src="/logo.png"
          alt="Stella Logo"
          width={96}
          height={96}
          className="h-24 w-24 mb-2"
        />
      </div>
      <LoginForm />
    </div>
  );
}
