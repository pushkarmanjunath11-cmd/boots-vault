'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
doc,
setDoc,
getDoc
} from "firebase/firestore";

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
const [user,setUser] = useState<any>(null);

/* 🔥 WATCH LOGIN */

useEffect(()=>{

const unsub = auth.onAuthStateChanged(async(u)=>{

setUser(u);

if(u){

const ref = doc(db,"carts",u.uid);
const snap = await getDoc(ref);

if(snap.exists()){
setCart(snap.data().items || []);
}

}

});

return ()=>unsub();

},[]);


/* 🔥 AUTO SAVE CART */

useEffect(()=>{

if(!user) return;

setDoc(doc(db,"carts",user.uid),{
items:cart
});

},[cart,user]);


/* FUNCTIONS */

function addToCart(item:CartItem){
setCart(prev=>[...prev,item]);
}

function removeFromCart(id:string,size:string){
setCart(prev=>prev.filter(
item=>!(item.id===id && item.size===size)
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
