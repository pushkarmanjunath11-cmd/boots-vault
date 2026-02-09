'use client';

import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartDrawer({open,setOpen}:any){

const {cart,removeFromCart} = useCart();

const total = cart.reduce((sum,item)=> sum + item.price,0);

return(

<>
{/* BACKDROP */}
{open && (
<div
onClick={()=>setOpen(false)}
style={{
position:"fixed",
top:0,
left:0,
width:"100vw",
height:"100vh",
background:"rgba(0,0,0,0.6)",
zIndex:9998
}}
/>
)}

<div style={{
position:"fixed",
top:0,
right: open ? "0px":"-420px",
width:"420px",
maxWidth:"100%",
height:"100vh",
background:"#0b0d11",
boxShadow:"-10px 0 40px rgba(0,0,0,.6)",
transition:"0.35s",
zIndex:9999,
padding:"20px",
display:"flex",
flexDirection:"column"
}}>

{/* HEADER */}
<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}>
<h2>Your Cart</h2>

<button
onClick={()=>setOpen(false)}
style={{
background:"transparent",
border:"none",
color:"white",
fontSize:"22px",
cursor:"pointer"
}}>
✕
</button>
</div>


{/* ITEMS */}
<div style={{flex:1,overflowY:"auto",marginTop:"20px"}}>

{cart.length === 0 && <p>Your cart is empty</p>}

{cart.map(item=>(

<div key={item.id+item.size} style={{
display:"flex",
gap:"10px",
marginBottom:"18px"
}}>

<img
src={item.image}
style={{
width:"70px",
height:"70px",
objectFit:"cover",
borderRadius:"8px"
}}
/>

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
padding:"6px 10px",
borderRadius:"6px",
cursor:"pointer"
}}>
X
</button>

</div>

))}

</div>


{/* FOOTER */}

{cart.length > 0 && (
<Link href="/checkout">
<button style={{
width:"100%",
padding:"16px",
background:"#22c55e",
border:"none",
borderRadius:"10px",
fontWeight:"700",
cursor:"pointer"
}}>
Checkout • ₹{total}
</button>
</Link>
)}

</div>
</>
);
}
