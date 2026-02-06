"use client";

import { useCart } from "../context/CartContext";

export default function CartDrawer({ open, setOpen }: any) {
const { cart } = useCart();

return (
<div
style={{
position: "fixed",
top: 0,
right: open ? 0 : "-400px",
width: "400px",
height: "100vh",
background: "#0f1115",
color: "white",
padding: "20px",
transition: "0.3s",
zIndex: 1000,
boxShadow: "-10px 0 30px rgba(0,0,0,0.5)"
}}
>

<h2 style={{marginBottom:"20px"}}>Your Cart</h2>

{cart.length === 0 ? (
<p style={{color:"#aaa"}}>Your cart is empty</p>
) : (
cart.map((item)=>(
<div key={item.id} style={{
display:"flex",
gap:"10px",
marginBottom:"15px",
alignItems:"center"
}}>
<img
src={item.image}
style={{
width:"60px",
height:"60px",
objectFit:"cover",
borderRadius:"8px"
}}
/>

<div>
<p style={{margin:0,fontWeight:600}}>{item.name}</p>
<p style={{margin:0,color:"#aaa"}}>₹{item.price}</p>
</div>

</div>
))
)}

<button
onClick={()=>setOpen(false)}
style={{
marginTop:"20px",
width:"100%",
padding:"12px",
background:"white",
color:"black",
border:"none",
borderRadius:"8px",
fontWeight:"bold",
cursor:"pointer"
}}
>
Close
</button>

</div>
);
}