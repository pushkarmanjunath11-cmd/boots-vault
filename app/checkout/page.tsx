'use client';

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage(){

const { cart, clearCart, removeFromCart } = useCart();
const router = useRouter();

/* ---------- TOTAL ---------- */

const total = cart.reduce((sum,item)=> sum + item.price,0);

/* ---------- EMPTY CART ---------- */

if(cart.length === 0){
return(

<div style={{
minHeight:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#0b0d11",
color:"white"
}}>

<div style={{textAlign:"center"}}>

<h1>Your cart is empty</h1>

<button
onClick={()=>router.push("/")}
style={{
marginTop:"20px",
padding:"12px 20px",
background:"#22c55e",
border:"none",
borderRadius:"8px",
fontWeight:"700",
cursor:"pointer"
}}
>
Continue Shopping
</button>

</div>
</div>
);
}

/* ---------- UI ---------- */

return(

<div style={{
padding:"40px",
background:"#0b0d11",
minHeight:"100vh",
color:"white"
}}>

<h1 style={{marginBottom:"30px"}}>Checkout</h1>


{/* ITEMS */}

<div style={{
display:"flex",
flexDirection:"column",
gap:"18px"
}}>

{cart.map((item,index)=>(

<div
key={item.id + item.size}
style={{
display:"flex",
gap:"16px",
background:"#11151c",
padding:"14px",
borderRadius:"12px",
alignItems:"center"
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

<p style={{margin:"4px 0",color:"#aaa"}}>
Size: {item.size}
</p>

<p style={{margin:0,fontWeight:"700"}}>
₹{item.price}
</p>

</div>

{/* ⭐ REMOVE BUTTON */}
<button
onClick={()=>removeFromCart(item.id, item.size)}
style={{
background:"#ef4444",
border:"none",
color:"white",
padding:"10px 14px",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"600",
transition:"0.2s"
}}
>
Remove
</button>

</div>

))}

</div>


{/* TOTAL */}

<div style={{
marginTop:"40px",
borderTop:"1px solid #222",
paddingTop:"20px"
}}>

<h2>Total: ₹{total}</h2>

<button
onClick={()=>{
alert("✅ Razorpay will open here once connected.");
clearCart();
router.push("/");
}}
style={{
marginTop:"20px",
width:"100%",
padding:"16px",
background:"#22c55e",
border:"none",
borderRadius:"12px",
fontWeight:"800",
fontSize:"18px",
cursor:"pointer"
}}
>
Proceed To Payment
</button>

</div>

</div>
);
}
