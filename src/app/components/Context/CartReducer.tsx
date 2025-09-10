import { getSession } from "next-auth/react";
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
}

export interface CartState {
  cartItems: CartItem[];
}

export const initialState: CartState = {
  cartItems: [],
};

export async function loadCartState(): Promise<CartState> {
  if (typeof window !== "undefined") {
    const session = await getSession();
    const userId = session?.user?.id || "guest";
    const stored = localStorage.getItem(`cart_${userId}`);
    return { cartItems: stored ? JSON.parse(stored) : [] };
  }
  return { cartItems: [] };
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string | number }
  | { type: "CLEAR_CART" }
  | { type: "INIT_CART"; payload: CartItem[] }; // 👈 add this
export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
  let updatedState: CartState;

  switch (action.type) {
    case "INIT_CART":
      return { ...state, cartItems: action.payload };

    case "ADD_ITEM":
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        updatedState = {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, qty: item.qty + action.payload.qty }
              : item
          ),
        };
      } else {
        updatedState = {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
      }
      break;

    case "REMOVE_ITEM":
      updatedState = {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.id !== action.payload
        ),
      };
      break;

    case "CLEAR_CART":
      updatedState = { ...state, cartItems: [] };
      break;

    default:
      return state;
  }

  if (typeof window !== "undefined") {
    getSession().then((session) => {
      const userId = session?.user?.id || "guest";
      localStorage.setItem(
        `cart_${userId}`,
        JSON.stringify(updatedState.cartItems)
      );
    });
  }

  return updatedState;
};