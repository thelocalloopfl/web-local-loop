/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import Toast from "./MessageTost";
import ReCAPTCHA from "react-google-recaptcha";
import { fetchCategories } from "../../lib/fetchCategories"; // ✅ Import the fetch function
import type { Category } from "../../lib/fetchCategories";

type ToastType = { id: number; message: string; type: string };

export default function EventSubmissionForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventTitle: "",
    eventDate: "",
    eventDetails: "",
    recaptchaToken: "",
    category: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPending, startTransition] = useTransition();
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // ✅ Fetch categories from Sanity (or your API)
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const showToast = (message: string, type: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.eventTitle ||
      !formData.eventDate ||
      !formData.eventDetails ||
      !formData.category
    ) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    if (!formData.recaptchaToken) {
      showToast("Please verify the reCAPTCHA.", "error");
      return;
    }

    startTransition(async () => {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (image) data.append("image", image);

      try {
        const response = await fetch("/api/submit-event", {
          method: "POST",
          body: data,
        });

        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Something went wrong");

        showToast(result.message, "success");
        setFormData({
          name: "",
          email: "",
          eventTitle: "",
          eventDate: "",
          eventDetails: "",
          recaptchaToken: "",
          category: "",
        });
        recaptchaRef.current?.reset();
        setImage(null);
        setPreview(null);
      } catch (error: unknown) {
        showToast(error instanceof Error ? error.message : "An unexpected error occurred.", "error");
      }
    });
  };

  return (
    <>
      {/* Toasts */}
      <div className="fixed top-0 right-0 p-4 space-y-2 z-50">
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
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mt-16 max-w-3xl mx-auto border border-gray-100">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-orange-700 mb-2">
          Submit Your Event
        </h3>
        <p className="text-center text-gray-600 mb-6">
          Have a local event you want to share? Fill out the form below for
          consideration.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border bg-[rgb(248,250,252)] border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border bg-[rgb(248,250,252)] border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Title + Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                id="eventTitle"
                type="text"
                value={formData.eventTitle}
                onChange={handleInputChange}
                className="w-full border bg-[rgb(248,250,252)] border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleInputChange}
                className="w-full border bg-[rgb(248,250,252)] border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>
          </div>

          {/* ✅ Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border bg-[rgb(248,250,252)] border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Details
            </label>
            <textarea
              id="eventDetails"
              rows={4}
              value={formData.eventDetails}
              onChange={handleInputChange}
              className="w-full border bg-[rgb(248,250,252)] border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-orange-400 focus:outline-none"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/webp"
              className="w-full text-sm bg-[rgb(248,250,252)] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />

            {preview && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                <img
                  src={preview}
                  alt="Selected event"
                  className="w-full max-h-64 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* ✅ reCAPTCHA */}
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) =>
              setFormData((prev) => ({ ...prev, recaptchaToken: token || "" }))
            }
            onExpired={() =>
              setFormData((prev) => ({ ...prev, recaptchaToken: "" }))
            }
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className={`text-white px-6 py-2 rounded-lg transition w-full flex items-center justify-center space-x-2
              ${
                isPending
                  ? "bg-orange-500 cursor-not-allowed"
                  : "bg-orange-700 cursor-pointer hover:bg-orange-800"
              }`}
          >
            {isPending ? "Submitting..." : "Submit Event"}
          </button>
        </form>
      </div>
    </>
  );
}
