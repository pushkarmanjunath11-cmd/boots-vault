"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Navbar(){

const pathname = usePathname();
const { cart } = useCart();

const [cartOpen,setCartOpen] = useState(false);
const [dropdown,setDropdown] = useState(false);
const [user,setUser] = useState<any>(undefined);

useEffect(()=>{
const unsub = onAuthStateChanged(auth,(u)=>{
setUser(u);
});

return ()=>unsub();
},[]);

return(
<>
<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"18px 40px",
background:"#020617",
borderBottom:"1px solid rgba(34,197,94,.15)",
position:"sticky",
top:0,
zIndex:999
}}>

{/* LOGO */}
<Link href="/" style={{
color:"#22c55e",
fontWeight:"900",
fontSize:"24px",
textDecoration:"none",
letterSpacing:"1px"
}}>
<span style={{
color:"#22c55e",
fontWeight:"900",
letterSpacing:"2px"
}}>
Boots
</span>

<span style={{fontWeight:"800"}}>
Vault
</span>

</Link>

{/* NAV ITEMS */}
<div style={{
display:"flex",
alignItems:"center",
gap:"28px"
}}>

<Link href="/"
style={{
color: pathname === "/" ? "#22c55e" : "#9ca3af",
textDecoration:"none",
fontWeight:"600"
}}>
Shop
</Link>


{/* CART */}
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


{/* ACCOUNT */}
<div style={{position:"relative"}}>

<button
onClick={()=>setDropdown(!dropdown)}
style={{
background:"transparent",
border:"1px solid rgba(255,255,255,.15)",
borderRadius:"50%",
width:"40px",
height:"40px",
fontSize:"18px",
cursor:"pointer"
}}
>
👤
</button>

{/* DROPDOWN */}

{dropdown && (

<div style={{
position:"absolute",
right:0,
top:"50px",
background:"#020617",
border:"1px solid rgba(34,197,94,.2)",
borderRadius:"12px",
padding:"10px",
width:"180px"
}}>

{user === undefined ? null : !user ? (

<button
onClick={()=>window.location.href="/login"}
style={dropdownBtn}
>
Login
</button>

) : (

<>
<button style={dropdownBtn}>My Orders</button>
<button
style={dropdownBtn}
onClick={()=>signOut(auth)}
>
    <button
style={dropdownBtn}
onClick={()=>window.location.href="/track"}
>
Track Order
</button>
Logout
</button>
</>

)}

</div>

)}

</div>

</div>
</div>

<CartDrawer open={cartOpen} setOpen={setCartOpen}/>

</>
);
}

const dropdownBtn = {
width:"100%",
padding:"10px",
background:"transparent",
border:"none",
color:"white",
cursor:"pointer",
textAlign:"left" as const
};
