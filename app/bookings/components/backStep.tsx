import { ArrowLeft } from "lucide-react";

interface BackStepProps {
  readonly onBack: () => void;
}

export const BackStep = ({ onBack }: BackStepProps) => {
  return (
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem("yoye_booking_state");
        onBack();
      }}
      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>กลับขั้นก่อนหน้า</span>
    </button>
  );
};
