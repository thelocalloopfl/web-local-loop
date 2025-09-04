"use client";

import React, { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiSend, FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../components/MessageTost";

type ToastType = { id: number; message: string; type: string };

const AuthPage = ({ logo }: { logo: React.ReactNode }) => {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [isPending, startTransition] = useTransition();

  // Show toast
  const showToast = (message: string, type: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      if (isForgot) {
        // Forgot Password Flow
        try {
          const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await res.json();
          if (!data.success) {
            showToast(data.message || "Something went wrong", "error");
          } else {
            showToast("Password reset email sent!", "success");
            resetForm();
          }
        } catch (error) {
          showToast("Request failed. Try again.", "error");
        }
      } else if (isSignup) {
        // Signup Flow
        try {
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              phone,
              password,
              confirmPassword,
            }),
          });

          const data = await res.json();
          if (!data.success) {
            showToast(data.message, "error");
          } else {
            showToast("Signup successful! Please login.", "success");
            setIsSignup(false);
            resetForm();
          }
        } catch (error) {
          showToast("Signup failed. Try again.", "error");
        }
      } else {
        // Login Flow
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          showToast("Invalid credentials", "error");
        } else {
          showToast("Login successful! Redirecting...", "success");
          router.push("/home");
        }
      }
    });
  };

  return (
    <section className="py-16 px-4 text-black bg-gradient-to-l to-orange-100 via-white from-yellow-100 min-h-screen flex items-center justify-center">
      {/* Toasts */}
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center">{logo}</div>

          {/* Title & subtitle */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignup ? "signup-title" : isForgot ? "forgot-title" : "login-title"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-center text-orange-700 mb-2">
                {isSignup
                  ? "Create Account"
                  : isForgot
                  ? "Forgot Password"
                  : "Welcome Back"}
              </h2>
              <p className="text-center text-gray-500 mb-6">
                {isSignup
                  ? "Sign up to get started"
                  : isForgot
                  ? "Enter your email to reset password"
                  : "Login to access your account"}
              </p>
            </motion.div>
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isSignup && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500"
                >
                  <FiUser className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white outline-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email always visible */}
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500">
              <FiMail className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white outline-none"
                required
              />
            </div>

            <AnimatePresence mode="popLayout">
              {isSignup && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500"
                >
                  <FiPhone className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white outline-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password (hide for forgot password) */}
            {!isForgot && (
              <>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500">
                  <FiLock className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white outline-none"
                    required
                  />
                </div>

                <AnimatePresence mode="popLayout">
                  {isSignup && (
                    <motion.div
                      key="confirmPassword"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500"
                    >
                      <FiLock className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white outline-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* Button */}
            <AnimatePresence mode="wait">
              <motion.button
                key={isSignup ? "signup-btn" : isForgot ? "forgot-btn" : "login-btn"}
                type="submit"
                disabled={isPending}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`w-full px-6 cursor-pointer py-2 rounded-lg transition flex items-center justify-center space-x-2 ${
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
                    <span>
                      {isSignup
                        ? "Sign Up"
                        : isForgot
                        ? "Send Reset Link"
                        : "Login"}
                    </span>
                  </>
                )}
              </motion.button>
            </AnimatePresence>
          </form>

          {/* Toggle Options */}
          <p className="mt-6 text-center text-gray-600">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  className="text-orange-700 font-semibold underline cursor-pointer"
                  onClick={() => {
                    setIsSignup(false);
                    setIsForgot(false);
                    resetForm();
                  }}
                >
                  Login
                </button>
              </>
            ) : isForgot ? (
              <>
                Remember your password?{" "}
                <button
                  className="text-orange-700 font-semibold underline cursor-pointer"
                  onClick={() => {
                    setIsForgot(false);
                    resetForm();
                  }}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  className="text-orange-700 font-semibold underline cursor-pointer"
                  onClick={() => {
                    setIsSignup(true);
                    setIsForgot(false);
                    resetForm();
                  }}
                >
                  Sign Up
                </button>
                <br />
                <button
                  className="mt-2 text-sm text-gray-500 underline cursor-pointer"
                  onClick={() => {
                    setIsForgot(true);
                    setIsSignup(false);
                    resetForm();
                  }}
                >
                  Forgot Password?
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AuthPage;
