"use client";
import React, { useState } from "react";

const NewsletterBox: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error?.message || "Subscription failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("A network error occurred. Please try again later.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center pb-5">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[230px] lg:max-w-[300px] bg-white dark:bg-gray-800 rounded overflow-hidden shadow-md focus-within:ring-2 focus-within:ring-orange-400 transition"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-200 dark:bg-gray-800 text-sm focus:outline-none min-w-0"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`bg-orange-500 text-white px-5 py-3 font-semibold text-sm transition-colors duration-200 whitespace-nowrap 
            ${status === "loading" ? "opacity-75 cursor-not-allowed" : "hover:bg-orange-600"}`}
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-sm font-medium border rounded-md p-3 w-[250px] max-w-md text-center transition-all duration-300 ${
            status === "success"
              ? "border-green-600 bg-green-100 dark:bg-green-900/40 dark:border-green-500 text-green-700 dark:text-green-300"
              : "border-red-600 bg-red-100 dark:bg-red-900/40 dark:border-red-500 text-red-700 dark:text-red-300"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterBox;
