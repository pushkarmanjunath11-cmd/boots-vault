'use client';

import { createContext, useContext, useState } from "react";

export type CartItem = {
  id:string;
  name:string;
  price:number;
  image:string;
  size:string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart:(item:CartItem)=>void;
  removeFromCart:(id:string,size:string)=>void;
  clearCart:()=>void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({children}:{children:React.ReactNode}){

const [cart,setCart] = useState<CartItem[]>([]);

function addToCart(item:CartItem){
  setCart(prev => [...prev,item]);
}

function removeFromCart(id:string,size:string){
  setCart(prev => prev.filter(
    item => !(item.id === id && item.size === size)
  ));
}

function clearCart(){
  setCart([]);
}

return(
<CartContext.Provider value={{
cart,
addToCart,
removeFromCart,
clearCart
}}>
{children}
</CartContext.Provider>
);
}

export function useCart(){

const context = useContext(CartContext);

if(!context){
throw new Error("useCart must be used inside CartProvider");
}

return context;
}
