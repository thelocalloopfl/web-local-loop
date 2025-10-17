/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useTransition, useRef } from "react";
import { FiDollarSign, FiMail, FiUsers, FiSend, FiPhone } from "react-icons/fi";
import { FaImage, FaFilePdf } from "react-icons/fa";
import Toast from "./MessageTost";
import ReCAPTCHA from "react-google-recaptcha";

type ToastType = { id: number; message: string; type: string };

export default function AdvertisePage() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    adZone: "",
    message: "",
    file: null as File | null,
    recaptchaToken: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = (message: string, type: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size should not exceed 5MB.", "error");
        return;
      }
      setForm({ ...form, file });
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else if (file.type === "application/pdf") {
        setPreviewUrl("pdf");
      } else {
        setPreviewUrl(null);
      }
    } else {
      setForm({ ...form, file: null });
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.businessName || !form.email || !form.message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (!form.recaptchaToken) {
      showToast("Please verify the reCAPTCHA.", "error");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "file" && typeof value === "string") formData.append(key, value);
    });
    if (form.file) formData.append("file", form.file);

    startTransition(async () => {
      try {
        const res = await fetch("/api/advertise-form", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          showToast("Inquiry submitted successfully!", "success");
          setForm({
            name: "",
            businessName: "",
            email: "",
            phone: "",
            adZone: "",
            message: "",
            file: null,
            recaptchaToken: "",
          });
          setPreviewUrl(null);
          recaptchaRef.current?.reset();
        } else {
          const errorData = await res.json();
          showToast(errorData.error || "Something went wrong.", "error");
        }
      } catch {
        showToast("⚠️ Network error. Try again later.", "error");
      }
    });
  };

  return (
    <div className="min-h-screen py-12 text-black">
      {/* ✅ Toast Messages */}
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

      {/* ✅ Header */}
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="flex justify-center mb-2">
          <FiDollarSign className="w-16 h-16 text-orange-700" />
        </div>
        <h1 className="text-4xl font-bold text-orange-700">
          Advertise With Us
        </h1>
        <p className="mt-4 text-gray-600">
          Connect with the Winter Garden community and grow your business by
          partnering with The Local Loop FL.
        </p>
      </div>

      {/* ✅ Why Partner Section */}
      <div className="max-w-6xl mx-auto mt-12 px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Why Partner with The Local Loop?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <FiMail className="w-10 h-10 text-orange-700" />,
              title: "Newsletter Sponsorship",
              desc: "Reach engaged local readers directly in their inbox each week.",
            },
            {
              icon: <FaImage className="w-10 h-10 text-green-500" />,
              title: "Website Banner Ads",
              desc: "Showcase your brand in top ad zones of our website.",
            },
            {
              icon: <FiUsers className="w-10 h-10 text-blue-500" />,
              title: "Sponsored Content",
              desc: "Get featured articles and spotlights highlighting your business.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#F8FAFC] shadow-md rounded-xl p-6 text-center hover:shadow-lg transition border border-gray-100"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Form Section */}
      <div className="mt-16 max-w-2xl mx-auto px-6 bg-white shadow-lg rounded-2xl p-8 space-y-5">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Get in Touch
        </h2>
        <p className="text-gray-500 text-center">
          Fill out the form below, and we&#39;ll get back to you with ad options
          and pricing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Inputs */}
          {[
            { label: "Your Name", name: "name", type: "text" },
            { label: "Business Name", name: "businessName", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            {
              label: "Phone Number",
              name: "phone",
              type: "tel",
            },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-gray-700 font-medium mb-1">
                {label}
              </label>
              <input
                type={type}
                value={(form as any)[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            </div>
          ))}

          {/* Message */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tell Us About Your Goals
            </label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 bg-[#F8FAFC] resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>


          {/* Ad Zone Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ad Zone (Optional)
            </label>
            <select
              value={form.adZone}
              onChange={(e) => setForm({ ...form, adZone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 bg-[rgb(248,250,252)] text-gray-700 
                focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent 
                hover:bg-white transition-all duration-200 ease-in-out cursor-pointer"
            >
              <option value="">Select Zone</option>
              <option value="Top">Top Banner</option>
              <option value="Bottom">Bottom Banner</option>
              <option value="Sidebar">Sidebar</option>
            </select>
          </div>


          {/* File Upload + Preview */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Ad (Image or PDF)
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full  border border-gray-300 rounded-lg p-3 bg-[rgb(248,250,252)] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />

            {previewUrl && (
              <div className="mt-3 border rounded-lg overflow-hidden">
                {previewUrl === "pdf" ? (
                  <div className="flex items-center gap-2 p-3 bg-gray-100">
                    <FaFilePdf className="text-red-600 w-6 h-6" />
                    <span className="text-sm text-gray-700">
                      {form.file?.name}
                    </span>
                  </div>
                ) : (
                  <img
                  src={previewUrl}
                  alt="Selected event"
                  className="w-full max-h-64 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                )}
              </div>
            )}
          </div>

          {/* reCAPTCHA */}
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) =>
              setForm({ ...form, recaptchaToken: token || "" })
            }
            onExpired={() => setForm({ ...form, recaptchaToken: "" })}
          />

          {/* Submit */}
          <div className="text-center pt-5">
            <button
              type="submit"
              disabled={isPending}
              className={`text-white px-6 py-3 w-full rounded-lg transition flex items-center justify-center gap-2 font-medium shadow-md
                ${
                  isPending
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-700 hover:bg-orange-800 cursor-pointer"
                }`}
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiSend className="w-5 h-5" />
                  Send Inquiry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
