export default function ReportToolbar() {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

      <button
        className="
          px-4 py-2
          rounded-xl
          text-white
          font-medium
          bg-[#708090]
          hover:opacity-90
        "
        style={{ fontFamily: "var(--font-marcellus)" }}
      >
        Seleccionar período
      </button>

      <button
        className="
          px-4 py-2
          rounded-xl
          text-white
          font-medium
          bg-[#B76E79]
          hover:opacity-90
        "
        style={{ fontFamily: "var(--font-marcellus)" }}
      >
        Exportar PDF
      </button>
    </div>
  );
}
