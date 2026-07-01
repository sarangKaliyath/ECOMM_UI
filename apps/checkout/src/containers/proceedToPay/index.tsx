import { CreditCard } from "lucide-react";

interface Props {
  onProceed: () => void;
}

const ProceedToPay = ({ onProceed }: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CreditCard size={18} className="text-blue-600" />
        <h2 className="text-base font-bold text-gray-900">Payment</h2>
      </div>

      <p className="text-sm text-gray-500">
        You'll be redirected to our secure payment provider to complete your purchase.
      </p>

      <button
        onClick={onProceed}
        className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Proceed to Pay
      </button>
    </div>
  );
};

export default ProceedToPay;
