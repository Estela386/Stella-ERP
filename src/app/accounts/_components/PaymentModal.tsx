"use client";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PaymentModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div
        className="
          w-full max-w-md
          bg-[#F6F3EF]
          rounded-[32px]
          p-8
          shadow-[0_40px_120px_rgba(0,0,0,0.35)]
          border border-[#D1BBAA]
          space-y-6
        "
      >
        <h2 className="text-2xl font-semibold text-[#3F3A34]">
          Payment
        </h2>

        <input
          placeholder="Amount"
          className="w-full p-3 rounded-xl border border-[#D1BBAA] bg-white"
        />

        <select className="w-full p-3 rounded-xl border border-[#D1BBAA] bg-white">
          <option>Cash</option>
          <option>Card</option>
          <option>Transfer</option>
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#708090] text-white"
          >
            Cancel
          </button>

          <button className="px-5 py-2 rounded-xl bg-[#B76379] text-white shadow-lg">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}