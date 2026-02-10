'use client';

import { useCart } from "@/app/context/CartContext";

export default function CheckoutPage(){

const { cart, removeFromCart, clearCart } = useCart();

/* ---------- TOTAL ---------- */

const total = cart.reduce((sum,item)=> sum + item.price,0);

/* ---------- WHATSAPP MESSAGE ---------- */

function handleWhatsApp(){

if(cart.length === 0) return;

let message = `🛒 *New Order — Boots Vault* %0A%0A`;

cart.forEach((item,index)=>{

message += `*${index+1}. ${item.name}* %0A`;
message += `Size: ${item.size} %0A`;
message += `Price: ₹${item.price} %0A`;
message += `Image: ${item.image} %0A%0A`;

});

message += `💰 *Total: ₹${total}*`;

const phone = "917996097779"; // ← PUT YOUR NUMBER
const url = `https://wa.me/${phone}?text=${message}`;

window.open(url,"_blank");

clearCart(); // empties cart after clicking checkout
}

/* ---------- UI ---------- */

return(

<div style={{
minHeight:"100vh",
background:"#020617",
padding:"40px 20px",
color:"white"
}}>

<h1 style={{
fontSize:"32px",
marginBottom:"30px"
}}>
Checkout
</h1>


{/* EMPTY CART */}

{cart.length === 0 && (
<h2 style={{opacity:.6}}>
Your cart is empty
</h2>
)}


{/* ITEMS */}

<div style={{
display:"flex",
flexDirection:"column",
gap:"18px",
maxWidth:"700px"
}}>

{cart.map(item=>(

<div
key={`${item.id}-${item.size}`}
style={{
display:"flex",
gap:"16px",
alignItems:"center",
background:"linear-gradient(145deg,#0f172a,#020617)",
padding:"16px",
borderRadius:"14px",
border:"1px solid rgba(34,197,94,.15)"
}}
>

<img
src={item.image}
style={{
width:"90px",
height:"90px",
objectFit:"cover",
borderRadius:"10px"
}}
/>

<div style={{flex:1}}>

<h3 style={{margin:0}}>
{item.name}
</h3>

<p style={{opacity:.7}}>
Size: {item.size}
</p>

<p style={{
color:"#22c55e",
fontWeight:"700"
}}>
₹{item.price}
</p>

</div>

<button
onClick={()=>removeFromCart(item.id,item.size)}
style={{
background:"#ef4444",
border:"none",
color:"white",
padding:"10px 14px",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"700"
}}
>
Remove
</button>

</div>

))}

</div>


{/* TOTAL */}

{cart.length > 0 && (

<div style={{
marginTop:"40px",
maxWidth:"700px"
}}>

<h2>
Total: ₹{total}
</h2>

<button
onClick={handleWhatsApp}
style={{
marginTop:"16px",
width:"100%",
padding:"18px",
borderRadius:"14px",
border:"none",
fontSize:"18px",
fontWeight:"800",
cursor:"pointer",
background:"linear-gradient(90deg,#22c55e,#4ade80)",
color:"#022c22"
}}
>
Checkout on WhatsApp
</button>

</div>

)}

</div>
);
}
