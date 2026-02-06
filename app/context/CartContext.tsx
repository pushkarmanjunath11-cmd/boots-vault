"use client";

import { createContext, useContext, useState } from "react";

type Product = {
id: string;
name: string;
price: number;
image: string;
stock: number;
category: string;
};

type CartContextType = {
cart: Product[];
setCart: React.Dispatch<React.SetStateAction<Product[]>>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
const [cart, setCart] = useState<Product[]>([]);

return (
<CartContext.Provider value={{ cart, setCart }}>
{children}
</CartContext.Provider>
);
}

export function useCart() {
const context = useContext(CartContext);

if (!context) {
throw new Error("useCart must be used inside CartProvider");
}

return context;
}