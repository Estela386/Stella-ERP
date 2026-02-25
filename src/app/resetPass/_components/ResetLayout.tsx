export default function ResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F3EF] relative overflow-hidden">

      {/* DECORACIÓN */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,#B76E79,transparent_10%)]" />

      {/* LOGO */}
      <div className="absolute top-16 text-center">
        <div className="text-[#3F3A34] text-4xl font-serif tracking-wide">
          Stella
        </div>
      </div>

      {children}
    </div>
  );
}