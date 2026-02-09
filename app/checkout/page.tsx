'use client';

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage(){

const { cart, removeFromCart, clearCart } = useCart();
const router = useRouter();

/* ✅ TOTAL */
const total = cart.reduce((sum,item)=> sum + item.price,0);

/* ✅ PLACE ORDER (Razorpay will go here later) */
function handleCheckout(){

if(cart.length === 0){
alert("Your cart is empty");
return;
}

/* TEMP SUCCESS FLOW */
alert("Order placed! (Next step = Razorpay)");

clearCart();
router.push("/");
}

return(

<div style={{
padding:"40px",
minHeight:"100vh",
background:"#0b0d11",
color:"white"
}}>

<h1>Checkout</h1>

{/* EMPTY CART */}

{cart.length === 0 && (

<div style={{
marginTop:"40px",
padding:"30px",
background:"#111",
borderRadius:"12px"
}}>
<h2>Your cart is empty</h2>

<button
onClick={()=>router.push("/")}

style={{
marginTop:"20px",
padding:"12px 20px",
background:"#22c55e",
border:"none",
borderRadius:"8px",
fontWeight:"600",
cursor:"pointer"
}}
>
Continue Shopping
</button>

</div>

)}


{/* CART ITEMS */}

{cart.length > 0 && (

<>
<div style={{
marginTop:"30px",
display:"grid",
gap:"20px"
}}>

{cart.map((item,index)=>(

<div key={index} style={{
display:"flex",
gap:"20px",
background:"#11151c",
padding:"20px",
borderRadius:"12px",
alignItems:"center",
flexWrap:"wrap"
}}>

<img
src={item.image}
style={{
width:"100px",
height:"100px",
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
fontWeight:"700",
fontSize:"18px"
}}>
₹{item.price}
</p>

</div>

<button
onClick={()=>removeFromCart(item.id,item.size)}

style={{
background:"red",
border:"none",
color:"white",
padding:"10px",
borderRadius:"8px",
cursor:"pointer"
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
padding:"30px",
background:"#111",
borderRadius:"12px"
}}>

<h2>Total: ₹{total}</h2>

<button
onClick={handleCheckout}

style={{
width:"100%",
marginTop:"20px",
padding:"18px",
fontSize:"18px",
background:"#22c55e",
border:"none",
borderRadius:"12px",
fontWeight:"700",
cursor:"pointer"
}}
>
Place Order
</button>

</div>

</>

)}

</div>
);
}
