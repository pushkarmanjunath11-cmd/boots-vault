"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import { usePathname } from "next/navigation";

export default function Navbar() {

const { cart } = useCart();
const [cartOpen, setCartOpen] = useState(false);
const pathname = usePathname();

/* ✅ AUTO CLOSE CART ON PAGE CHANGE (VERY IMPORTANT) */
useEffect(()=>{
setCartOpen(false);
},[pathname]);

return (
<>

{/* NAVBAR */}
<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"18px 40px",
background:"#0B0F14",
color:"#fff",
position:"sticky",
top:0,
zIndex:999,
borderBottom:"1px solid #1F2937"
}}>

 <Link href="/login">Login</Link>

{/* LOGO → GO HOME */}
<Link href="/" style={{
textDecoration:"none",
color:"white",
fontWeight:800,
fontSize:"22px",
letterSpacing:"0.5px"
}}>
Boots Vault
</Link>

{/* RIGHT SIDE */}
<div style={{
display:"flex",
gap:"28px",
alignItems:"center"
}}>

<Link href="/" style={{color:"white",textDecoration:"none"}}>
Shop
</Link>

<a
href="https://wa.me/917996097779"
style={{color:"white",textDecoration:"none"}}
>
Contact
</a>

{/* CART BUTTON */}
<button
onClick={()=>setCartOpen(true)}
style={{
background:"transparent",
border:"none",
color:"white",
fontSize:"20px",
cursor:"pointer",
position:"relative"
}}
>
🛒

{/* CART COUNT */}
{cart.length > 0 && (
<span style={{
position:"absolute",
top:"-6px",
right:"-10px",
background:"#22c55e",
color:"black",
borderRadius:"50%",
fontSize:"12px",
width:"18px",
height:"18px",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"700"
}}>
{cart.length}
</span>
)}

</button>

</div>
</div>

{/* CART DRAWER */}
<CartDrawer open={cartOpen} setOpen={setCartOpen} />

</>
);
}
