'use client';

import { createContext, useContext, useState } from "react";

/* ✅ CART ITEM TYPE */
export type CartItem = {
  id:string;
  name:string;
  price:number;
  image:string;
  category:string;
  size:string;
};

/* ✅ CONTEXT TYPE */
type CartContextType = {
  cart:CartItem[];
  addToCart:(product:any, size:string)=>void;
  removeFromCart:(id:string, size:string)=>void;
  clearCart:()=>void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({children}:{children:React.ReactNode}){

const [cart,setCart] = useState<CartItem[]>([]);

/* ✅ ADD */
function addToCart(product:any, size:string){

const item:CartItem = {
id:product.id,
name:product.name,
price:product.price,
image:product.images?.[0] || product.image,
category:product.category,
size
};

setCart(prev => [...prev,item]);
}

/* ✅ REMOVE */
function removeFromCart(id:string,size:string){

setCart(prev =>
prev.filter(item => !(item.id === id && item.size === size))
);

}

/* ✅ CLEAR */
function clearCart(){
setCart([]);
}

return(
<CartContext.Provider value={{cart,addToCart,removeFromCart,clearCart}}>
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
