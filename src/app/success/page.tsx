import { Suspense } from "react";
import SuccessInvoice from "./SuccessInvoice";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
        <p className="text-orange-500 animate-pulse">Loading invoice...</p>
      </div>}>
      <SuccessInvoice />
    </Suspense>
  );
}
