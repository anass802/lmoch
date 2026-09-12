// src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Product } from "../types/Clients";

export interface CartVariant {
  id: number;
  image_path: string | null;
  attributes: { value: string; hex_code?: string | null }[];
}

export interface CartItem {
  id: number;              
  variantId: number | null; 
  lineKey: string;
  is_promo:boolean;      
  name: string;
  price: number;
  category: string;
  image: string | null;     
  variant: CartVariant | null;
  value: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number, variant?: CartVariant | null) => void;
  removeFromCart: (lineKey: string) => void;
  updateQuantity: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "lmoch_guest_cart";

const makeLineKey = (productId: number, variantId: number | null) =>
  `${productId}-${variantId ?? "base"}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, quantity: number = 1, variant: CartVariant | null = null) => {
    const variantId = variant?.id ?? null;
    const lineKey = makeLineKey(product.id, variantId);

    setItems((prev:any) => {
      const existing = prev.find((item:any) => item.lineKey === lineKey);
      if (existing) {
        return prev.map((item:any) =>
          item.lineKey === lineKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          variantId,
          lineKey,
          name: product.name,
          price: Number(product.price),
          is_promo:Number(product.is_promo),
          category: product.category?.name ?? "",
          image: variant?.image_path ?? product.image ?? null,
          value: variant?.attributes.find((attr) => !attr.hex_code)?.value ?? null,
          variant,
          quantity,
        },
      ];
    });
    openCart();
  };

  const removeFromCart = (lineKey: string) => {
    setItems((prev) => prev.filter((item) => item.lineKey !== lineKey));
  };

  const updateQuantity = (lineKey: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(lineKey);
    setItems((prev) =>
      prev.map((item) => (item.lineKey === lineKey ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}