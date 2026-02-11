'use client';

import { useCart } from "@/app/context/CartContext";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Checkout(){

const {cart,removeFromCart,clearCart} = useCart();

const total = cart.reduce((sum,item)=>sum+item.price,0);

const router = useRouter();
const [user,setUser] = useState<any>(null);

useEffect(()=>{

const unsub = onAuthStateChanged(auth,(u)=>{

if(!u){
router.push("/login");
}else{
setUser(u);
}

});

return ()=>unsub();

},[]);

async function placeOrder(){

const user = auth.currentUser;

if(!user){
router.push("/login");
return;
}

await addDoc(collection(db,"orders"),{

invoice:"BV-"+Math.floor(100000 + Math.random()*900000)+Date.now(),
userId:user.uid,
email:user.email,

items:cart,
total,

status:"Processing",

createdAt:new Date()

});

clearCart();

alert("✅ Order Placed!");
router.push("/track");

}

return(

<div style={{
padding:"40px",
background:"#020617",
minHeight:"100vh",
color:"white"
}}>

<h1>Checkout</h1>

{cart.map(item=>(

<div key={item.id+item.size}
style={{
display:"flex",
gap:"20px",
marginBottom:"20px",
background:"#07122a",
padding:"15px",
borderRadius:"12px"
}}>

<img src={item.image} width={80}/>

<div style={{flex:1}}>
<p>{item.name}</p>
<p>Size: {item.size}</p>
<p>₹{item.price}</p>
</div>

<button
onClick={()=>removeFromCart(item.id,item.size)}
style={{
background:"red",
border:"none",
color:"white",
padding:"8px"
}}
>
Remove
</button>

</div>

))}

<h2>Total: ₹{total}</h2>

<button
onClick={placeOrder}
style={{
padding:"16px",
background:"#22c55e",
border:"none",
borderRadius:"10px",
fontWeight:"800",
cursor:"pointer"
}}
>
Place Order
</button>

</div>
);
}
