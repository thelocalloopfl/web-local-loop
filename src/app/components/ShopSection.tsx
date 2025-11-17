"use client";

import React, { useState } from "react";
import { useCart } from "../components/Context/Context";
import { FiShoppingCart, FiBox, FiLock, FiMail } from "react-icons/fi";
import Toast from "./MessageTost";
import Link from "next/link";
import Image from "next/image";

type ShopItem = {
  _id: string;
  title: string;
  price: number;
  desc: string;
  category: string;
  comingsoon: boolean;
  imageUrl?: string;
};

interface ShopSectionProps {
  shopItems: ShopItem[];
}

export default function ShopSection({ shopItems }: ShopSectionProps) {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);
  const { addToCart } = useCart();

  const showToast = (message: string, type: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <div className="main-content mx-auto px-5 py-16 dark:text-gray-100 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <FiBox className="h-16 w-16 text-orange-700 dark:text-orange-500" />
        </div>
        <h2 className="text-4xl font-bold text-orange-700 dark:text-orange-500">
          The Local Loop Shop
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
          Support The Local Loop FL and show your Winter Garden pride with our
          exclusive merchandise. More items coming soon!
        </p>
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {shopItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg py-12">
            No items available.
          </div>
        ) : (
          shopItems.map((item) => (
            <div
              key={item._id}
              className="
                bg-[var(--background)] border border-gray-200 dark:border-gray-700
                shadow-md rounded-2xl overflow-hidden flex flex-col
                hover:shadow-lg hover:border-orange-400 dark:hover:border-orange-500
                transition-all duration-300
              "
            >
              {/* Image */}
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={600}
                  height={300}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="h-44 w-full bg-gray-300 dark:bg-gray-800 flex items-center justify-center">
                  <FiBox className="text-gray-400 dark:text-gray-500 w-12 h-12" />
                </div>
              )}

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-2">
                  {item.category}
                </p>

                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-sm opacity-70 flex-grow mb-4">
                  {item.desc}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-green-700 dark:text-green-400">
                    {!item.comingsoon && `$${item.price.toFixed(2)}`}
                  </span>
                  <button
                    disabled={item.comingsoon}
                    onClick={() => {
                      addToCart({
                        id: item._id,
                        name: item.title,
                        price: item.price,
                        qty: 1,
                      });
                      showToast(`${item.title} added to cart!`, "success");
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-sm
                      transition-all duration-300 transform
                      ${
                        item.comingsoon
                          ? "bg-orange-300 dark:bg-orange-600/40 cursor-not-allowed"
                          : "bg-orange-700 text-white rounded-lg font-medium text-sm hover:bg-transparent hover:text-orange-700 dark:hover:text-orange-400 border border-orange-700 transition duration-200"
                      }
                    `}
                  >
                    {item.comingsoon ? (
                      <>
                        <FiLock /> Coming Soon
                      </>
                    ) : (
                      <>
                        <FiShoppingCart /> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
        />
      ))}

      {/* Stay Tuned */}
      <div className="bg-gradient-to-r from-yellow-300 via-white to-orange-300 rounded-2xl shadow p-8 text-black text-center">
        <div className="flex justify-center mb-4">
          <FiMail className="h-10 w-10 text-orange-700 dark:text-orange-500" />
        </div>
        <h3 className="text-xl font-bold mb-2 ">
          Stay Tuned for More!
        </h3>
        <p className=" mb-4 max-w-xl mx-auto">
          We’re always brewing up new ideas for The Local Loop Shop. Sign up for
          our newsletter to be the first to know about new arrivals and special
          offers.
        </p>
        <Link
          href="./newsletter"
          className="bg-orange-700 dark:bg-orange-600 hover:bg-orange-800 dark:hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Subscribe for Updates
        </Link>
      </div>
    </div>
  );
}
