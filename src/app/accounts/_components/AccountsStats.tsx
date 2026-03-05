export default function AccountsStats() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Total pendiente - color principal */}
      <div className="bg-[#708090] rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(140,137,118,0.4)]">
        <p className="text-[#f6f4ef]/80 text-sm tracking-wide">
          Total pendiente
        </p>
        <h3 className="text-3xl font-bold text-[#f6f4ef] mt-2">$ 12,500</h3>
      </div>

      {/* Pagado - color acento */}
      <div className="bg-[#b76e79] rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(140,137,118,0.4)]">
        <p className="text-[#f6f4ef]/80 text-sm tracking-wide">Pagado</p>
        <h3 className="text-3xl font-bold text-[#f6f4ef] mt-2">$ 8,200</h3>
      </div>

      {/* Cuentas activas - fondo claro con acento en texto */}
      <div className="bg-[#708090] rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(140,137,118,0.4)]">
        <p className="text-[#f6f4ef]/80 text-sm tracking-wide">
          Cuentas activas
        </p>
        <h3 className="text-3xl font-bold text-[#f6f4ef] mt-2">23</h3>
      </div>
    </div>
  );
}
