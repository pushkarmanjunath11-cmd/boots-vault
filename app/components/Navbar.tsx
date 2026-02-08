"use client";

import { useState } from "react";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function Navbar() {

const [cartOpen, setCartOpen] = useState(false);
const { cart } = useCart();

return (
<>
<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"20px 40px",
background:"black",
color:"white",
position:"sticky",
top:0,
zIndex:999
}}>

<Link href="/" style={{
textDecoration:"none",
color:"white",
fontWeight:"800",
fontSize:"22px",
cursor:"pointer"
}}>
Boots Vault
</Link>

<div style={{
display:"flex",
gap:"30px",
alignItems:"center"
}}>

<span style={{cursor:"pointer"}}>Shop</span>
<span style={{cursor:"pointer"}}>Contact</span>

<button
onClick={()=>setCartOpen(true)}
style={{
background:"transparent",
border:"none",
color:"white",
fontSize:"20px",
cursor:"pointer"
}}
>
🛒 {cart.length}
</button>

</div>
</div>

<CartDrawer open={cartOpen} setOpen={setCartOpen} />
</>
);
}