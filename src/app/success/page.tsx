import { Suspense } from "react";
import SuccessInvoice from "./SuccessInvoice";

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center p-10">Loading invoice...</p>}>
      <SuccessInvoice />
    </Suspense>
  );
}
