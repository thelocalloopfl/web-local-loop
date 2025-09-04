"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiLock, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "./MessageTost";

type ToastType = { id: number; message: string; type: string };

const ResetPage = ({ logo }: { logo: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [isPending, startTransition] = useTransition();

  const showToast = (message: string, type: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        });
        const data = await res.json();
        if (!data.success) {
          showToast(data.message || "Reset failed", "error");
        } else {
          showToast("Password reset successful! Redirecting...", "success");
          setTimeout(() => router.push("/login"), 2000);
        }
      } catch {
        showToast("Something went wrong", "error");
      }
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-l from-yellow-100 via-white to-orange-100 text-black">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
          }
        />
      ))}

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
          <div className="flex justify-center">{logo}</div>
          <h2 className="text-3xl font-bold text-center text-orange-700 mb-2">Reset Password</h2>
          <p className="text-center text-gray-500 mb-6">Enter your new password below.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500">
              <FiLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white outline-none"
                required
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500">
              <FiLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white outline-none"
                required
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.button
                key="reset-btn"
                type="submit"
                disabled={isPending}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`w-full px-6 py-2 rounded-lg flex items-center justify-center space-x-2 transition ${
                  isPending
                    ? "bg-orange-600 cursor-not-allowed"
                    : "bg-orange-700 hover:bg-orange-800 text-white"
                }`}
              >
                {isPending ? (
                  <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    <span>Reset Password</span>
                  </>
                )}
              </motion.button>
            </AnimatePresence>
          </form>
          <p className="text-center text-gray-500 mt-6">
            Remembered your password?{" "}
            <Link href="/login" className="text-orange-600 hover:underline font-medium">
              Back to Login
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default ResetPage;
