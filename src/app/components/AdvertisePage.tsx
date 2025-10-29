/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import { FiDollarSign, FiMail, FiUsers, FiSend } from "react-icons/fi";
import { FaImage, FaFilePdf } from "react-icons/fa";
import Toast from "./MessageTost";
import ReCAPTCHA from "react-google-recaptcha";
import { fetchSideBar } from "@/lib/fetchSidebar";
import Link from "next/link";
import Image from "next/image";

type ToastType = { id: number; message: string; type: string };

export default function AdvertisePage() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const [sidebar] = await Promise.all([fetchSideBar()]);
      setData({ sidebar });
    }
    loadData();
  }, []);

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
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
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
        const res = await fetch("/api/advertise-form", { method: "POST", body: formData });
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

  if (!data) return null;
  const { sidebar } = data;
  const hasAdv = sidebar && Array.isArray(sidebar) && sidebar.length > 0;

  return (
    <div className="min-h-screen py-12 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* ✅ Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
        />
      ))}

      {/* ✅ Advertise Grid */}
      {hasAdv && (
        <div className="mt-2 mb-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-[var(--card-bg)] rounded-2xl shadow border border-[var(--border-color)]">
            {sidebar.map((item: any) => (
              <div
                key={item._id}
                className="relative group bg-[var(--card-bg)] rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-40 sm:h-48 w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-white text-base font-semibold mb-1">
                    {item.title.length > 40 ? item.title.slice(0, 40) + "..." : item.title}
                  </h3>
                  <p className="text-white/80 text-xs mb-3 line-clamp-2">
                    {item.text.length > 60 ? item.text.slice(0, 60) + "..." : item.text}
                  </p>
                  <div className="flex justify-end">
                    <Link
                      href={item.buttonLink ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1.5 text-xs rounded-full font-semibold shadow hover:from-yellow-500 hover:to-yellow-700 transition"
                    >
                      Read More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* ✅ Header */}
      <div className="text-center max-w-2xl mx-auto px-4">
        <FiDollarSign className="w-16 h-16 text-[var(--main-orange)] mx-auto mb-2" />
        <h1 className="text-4xl font-bold text-[var(--main-orange)]">Advertise With Us</h1>
        <p className="mt-4 text-gray-600">
          Connect with the Winter Garden community and grow your business by partnering with The Local Loop FL.
        </p>
      </div>

      {/* ✅ Why Partner Section */}
      <div className="max-w-6xl mx-auto mt-12 px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-8">Why Partner with The Local Loop?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <FiMail className="w-10 h-10 text-[var(--main-orange)]" />,
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
              className="bg-[var(--card-bg)] border border-[var(--border-color)] shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-[var(--muted-text)] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Form */}
      <div className="mt-16 max-w-2xl mx-auto px-6 bg-[var(--card-bg)] border border-[var(--border-color)] shadow-lg rounded-2xl p-8 space-y-5">
        <h2 className="text-3xl font-bold text-center mb-6">Get in Touch</h2>
        <p className="text-[var(--muted-text)] text-center">
          Fill out the form below, and we&#39;ll get back to you with ad options and pricing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[ // Inputs
            { label: "Your Name", name: "name", type: "text" },
            { label: "Business Name", name: "businessName", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Phone Number", name: "phone", type: "tel" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              <input
                type={type}
                value={(form as any)[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className="w-full border border-[var(--border-color)] bg-[rgb(248,250,252)] rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-[var(--main-orange)]"
              />
            </div>
          ))}

          <div>
            <label className="block mb-1 font-medium">Tell Us About Your Goals</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-[var(--border-color)] bg-[rgb(248,250,252)]  rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-[var(--main-orange)] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Ad Zone (Optional)</label>
            <select
              value={form.adZone}
              onChange={(e) => setForm({ ...form, adZone: e.target.value })}
              className="w-full border border-[var(--border-color)] bg-[rgb(248,250,252)] rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-[var(--main-orange)] cursor-pointer"
            >
              <option value="">Select Zone</option>
              <option value="Top">Top Banner</option>
              <option value="Bottom">Bottom Banner</option>
              <option value="Sidebar">Sidebar</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Upload Ad (Image or PDF)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full border border-[var(--border-color)] rounded-lg p-3 text-[var(--muted-text)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 dark:file:bg-[#262626] file:text-[var(--main-orange)] hover:file:bg-orange-100 dark:hover:file:bg-[#333]"
            />
            {previewUrl && (
              <div className="mt-3 border border-[var(--border-color)] rounded-lg overflow-hidden">
                {previewUrl === "pdf" ? (
                  <div className="flex items-center gap-2 p-3 bg-[var(--muted-bg)]">
                    <FaFilePdf className="text-red-600 w-6 h-6" />
                    <span className="text-sm">{form.file?.name}</span>
                  </div>
                ) : (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full max-h-64 object-cover rounded-lg border border-[var(--border-color)] shadow-sm"
                  />
                )}
              </div>
            )}
          </div>

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setForm({ ...form, recaptchaToken: token || "" })}
            onExpired={() => setForm({ ...form, recaptchaToken: "" })}
          />

          <button
            type="submit"
            disabled={isPending}
            className={`w-full px-6 py-3 rounded-lg text-white flex items-center justify-center gap-2 font-medium transition ${
              isPending ? "bg-[var(--main-orange)]/60 cursor-not-allowed" : "bg-[var(--main-orange)] hover:opacity-90"
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
        </form>
      </div>
    </div>
  );
}
