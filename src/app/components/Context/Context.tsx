"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { cartReducer, initialState, CartItem, loadCartState } from "./CartReducer";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);

  // 👇 Load cart from localStorage + session on mount
  useEffect(() => {
    (async () => {
      const state = await loadCartState();
      dispatch({ type: "INIT_CART", payload: state.cartItems });
    })();
  }, []);

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeFromCart = (id: string | number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        cart: cartState.cartItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
