"use client";

import dynamic from "next/dynamic";

const CartSection = dynamic(() => import("../../components/CartSection"), {
  ssr: false,
  loading: () => (
    <div className="main-content mx-auto px-5 py-13 text-black h-dvh flex items-center justify-center">
        <p className="text-orange-700">Loading cart...</p>
    </div>
  ),
});

export default function CartWrapper() {
  return <CartSection />;
}
