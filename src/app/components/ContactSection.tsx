"use client";

import React, { useState, useTransition, useRef } from "react";
import { FiMail, FiSend } from "react-icons/fi";
import { GoLocation } from "react-icons/go";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { BsChatSquare } from "react-icons/bs";
import Toast from "./MessageTost";
import ReCAPTCHA from "react-google-recaptcha";

type ToastType = { id: number; message: string; type: string };

const ContactSection = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [ispending, setTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    email: "",
    question: "",
    message: "",
    recaptchaToken: "",
  });
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = (message: string, type: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.question || !form.message) {
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

    setTransition(async () => {
      try {
        const res = await fetch("/api/contact-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          showToast("Message sent successfully!", "success");
          setForm({
            name: "",
            email: "",
            question: "",
            message: "",
            recaptchaToken: "",
          });
          recaptchaRef.current?.reset();
        } else {
          const errorData = await res.json();
          showToast(errorData.error || "Something went wrong.", "error");
        }
      } catch {
        showToast("Network error. Try again later.", "error");
      }
    });
  };

  return (
    <section className="py-16 text-black dark:text-white">
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

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BsChatSquare className="text-orange-700 dark:text-orange-400 text-4xl" />
          </div>
          <h2 className="text-4xl font-bold text-orange-700 dark:text-orange-400">
            Get In Touch
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a question, suggestion, or a local story to share? We’d love to
            hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div
            className="
              md:col-span-2 w-full mx-auto px-4 rounded-lg shadow-md p-6
              border border-gray-200 dark:border-gray-700
              bg-[var(--background)] text-[var(--foreground)]
              transition-colors duration-300
            "
          >
            <h3 className="text-2xl font-bold text-[var(--main-orange)] mb-2">
              Send Us a Message
            </h3>
            <p className="text-[var(--muted-text)] text-sm mb-6">
              Fill out the form, and our team will get back to you shortly.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-700 bg-[rgb(248,250,252)] text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--main-orange)] focus:outline-none"
              />

              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Your Email
              </label>
              <input
                type="text"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-700 bg-[rgb(248,250,252)] text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--main-orange)] focus:outline-none"
              />

              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Question About
              </label>
              <input
                type="text"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-700 bg-[rgb(248,250,252)] text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--main-orange)] focus:outline-none"
              />

              <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Your Message
              </label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-700 bg-[rgb(248,250,252)] text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--main-orange)] focus:outline-none"
              ></textarea>

              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={(token) =>
                  setForm({ ...form, recaptchaToken: token || "" })
                }
                onExpired={() => setForm({ ...form, recaptchaToken: "" })}
              />

              <button
                type="submit"
                disabled={ispending}
                className={`text-white px-6 py-2 rounded-lg transition w-full flex items-center justify-center space-x-2
                  ${
                    ispending
                      ? "bg-[var(--main-orange)]/60 cursor-not-allowed"
                      : "bg-[var(--main-orange)] hover:opacity-90"
                  }`}
              >
                {ispending ? (
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin "></div>
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Connect */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6">
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                Other Ways to Connect
              </h4>
              <p className="flex items-start mb-4 text-sm">
                <FiMail className="text-orange-700 dark:text-orange-400 w-5 h-5 mr-3 mt-0.5" />
                <span>
                  <strong>Email Us Directly</strong>
                  <br />
                  <a
                    href="mailto:hello@thelocalloopfl.com"
                    className="text-orange-700 dark:text-orange-400 hover:underline"
                  >
                    hello@thelocalloopfl.com
                  </a>
                </span>
              </p>
              <p className="flex items-start text-sm">
                <GoLocation className="text-orange-700 dark:text-orange-400 w-5 h-5 mr-3 mt-0.5" />
                <span>
                  <strong>Our Community Base</strong>
                  <br />
                  Winter Garden, Florida (Online First!)
                </span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6">
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
                Follow Our Loop
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Stay updated and join the conversation on social media:
              </p>
              <div className="flex space-x-4 text-orange-700 dark:text-orange-400 text-md">
                <a
                  href="#"
                  className="hover:text-orange-800 dark:hover:text-orange-300 border border-orange-700 dark:border-orange-500 hover:border-orange-700 dark:hover:border-orange-400 rounded-3xl p-1 bg-white dark:bg-gray-800"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="hover:text-orange-800 dark:hover:text-orange-300 border border-orange-700 dark:border-orange-500 hover:border-orange-700 dark:hover:border-orange-400 rounded-3xl p-1 bg-white dark:bg-gray-800"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="hover:text-orange-800 dark:hover:text-orange-300 border border-orange-700 dark:border-orange-500 hover:border-orange-700 dark:hover:border-orange-400 rounded-3xl p-1 bg-white dark:bg-gray-800"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  className="hover:text-orange-800 dark:hover:text-orange-300 border border-orange-700 dark:border-orange-500 hover:border-orange-700 dark:hover:border-orange-400 rounded-3xl p-1 bg-white dark:bg-gray-800"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
