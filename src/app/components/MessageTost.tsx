"use client";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: string;
  onClose: () => void;
}) => {
  const isSuccess = type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`fixed top-6 right-6 max-w-sm w-full flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl z-50 backdrop-blur-xl border 
        ${isSuccess
          ? "bg-gradient-to-r from-green-500/70 to-emerald-600/90 border-green-400 shadow-green-500/40"
          : "bg-gradient-to-r from-red-500/70 to-rose-600/90 border-red-400 shadow-red-500/40"
        }`}
    >
      {/* Icon */}
      <div className="mt-1 flex-shrink-0">
        {isSuccess ? (
          <FiCheckCircle className="text-white text-2xl drop-shadow-md" />
        ) : (
          <FiXCircle className="text-white text-2xl drop-shadow-md" />
        )}
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className="text-md font-semibold tracking-wide text-white drop-shadow-sm">
          {isSuccess ? "Success" : "Error"}
        </p>
        <p className="text-sm text-white/90 mt-0.5 leading-snug">
          {message}
        </p>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
          className="h-1 mt-3 rounded-full bg-gradient-to-r from-white/30 to-white/60"
        />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="ml-2 text-white/80 cursor-pointer hover:text-white transition-colors text-lg font-bold leading-none"
      >
        ×
      </button>
    </motion.div>
  );
};

export default Toast;
