'use client';

import { createContext, useContext, useState } from "react";

type CartItem = {
  id:string;
  name:string;
  price:number;
  image?:string;
  images?:string[];
  selectedSize?:string;
  quantity:number;
};

type CartContextType = {
  cart:CartItem[];
  addToCart:(product:any, size?:string)=>void;
  removeFromCart:(id:string, size?:string)=>void;
  clearCart:()=>void;
  total:number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({children}:{children:React.ReactNode}){

const [cart,setCart] = useState<CartItem[]>([]);

/* ADD */

function addToCart(product:any, size?:string){

setCart(prev=>{

const existing = prev.find(
item => item.id === product.id && item.selectedSize === size
);

if(existing){
return prev.map(item =>
item.id === product.id && item.selectedSize === size
? {...item, quantity:item.quantity+1}
: item
);
}

return [
...prev,
{...product, selectedSize:size, quantity:1}
];

});
}

/* REMOVE */

function removeFromCart(id:string,size?:string){
setCart(prev =>
prev.filter(item =>
!(item.id===id && item.selectedSize===size)
)
);
}

/* TOTAL */

const total = cart.reduce(
(sum,item)=>sum + item.price * item.quantity,0
);

function clearCart(){
setCart([]);
}

return(
<CartContext.Provider value={{
cart,
addToCart,
removeFromCart,
clearCart,
total
}}>
{children}
</CartContext.Provider>
);
}

export function useCart(){
const ctx = useContext(CartContext);
if(!ctx) throw new Error("CartProvider missing");
return ctx;
}
