interface Props {
  onAddAccount: () => void;
  onAddPayment: () => void;
  onAddClient: () => void;
}

export default function AccountsToolbar({
  onAddAccount,
  onAddPayment,
  onAddClient,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 justify-between items-center">

      <h2 className="text-2xl font-semibold text-[#3F3A34]">
        Cuentas por cobrar
      </h2>

      <div className="flex gap-3">

        <button
          onClick={onAddClient}
          className="bg-white border px-4 py-2 rounded-xl shadow hover:shadow-md"
        >
          + Cliente
        </button>

        <button
          onClick={onAddAccount}
          className="bg-[#B76379] text-white px-4 py-2 rounded-xl shadow"
        >
          + Cuenta
        </button>

        <button
          onClick={onAddPayment}
          className="bg-[#3F3A34] text-white px-4 py-2 rounded-xl shadow"
        >
          + Abono
        </button>

      </div>
    </div>
  );
}