"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";

export default function Navbar(){

const pathname = usePathname();
const { cart } = useCart();

const [cartOpen,setCartOpen] = useState(false);
const [dropdown,setDropdown] = useState(false);
const [user,setUser] = useState<any>(undefined);

/* 🔥 refs for outside click */
const dropdownRef = useRef<HTMLDivElement>(null);


/* ✅ auth listener */
useEffect(()=>{
const unsub = onAuthStateChanged(auth,(u)=>{
setUser(u);
});

return ()=>unsub();
},[]);


/* ✅ CLOSE DROPDOWN WHEN CLICK OUTSIDE */
useEffect(()=>{

function handleClick(e:any){
if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
setDropdown(false);
}
}

document.addEventListener("mousedown",handleClick);

return ()=>{
document.removeEventListener("mousedown",handleClick);
};

},[]);


/* ✅ AUTO CLOSE CART ON PAGE CHANGE */
useEffect(()=>{
setCartOpen(false);
},[pathname]);



return(
<>
<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"18px 48px",
background:"rgba(2,6,23,.75)",
backdropFilter:"blur(16px)",
borderBottom:"1px solid rgba(34,197,94,.12)",
position:"sticky",
top:0,
zIndex:9999
}}>

{/* 🔥 LOGO */}

<Link href="/" style={{
fontWeight:"900",
fontSize:"26px",
letterSpacing:"1px",
textDecoration:"none"
}}>

<span style={{
color:"#22c55e"
}}>
Boots
</span>

<span style={{
color:"white"
}}>
Vault
</span>

</Link>



{/* NAV RIGHT */}

<div style={{
display:"flex",
alignItems:"center",
gap:"28px"
}}>

{/* SHOP */}

<Link href="/"
style={{
color: pathname === "/" ? "#22c55e" : "#9ca3af",
fontWeight:"700",
textDecoration:"none",
transition:"0.25s"
}}>
Shop
</Link>



{/* CART */}

<button
onClick={()=>setCartOpen(true)}
style={{
background:"rgba(255,255,255,.05)",
border:"1px solid rgba(255,255,255,.08)",
borderRadius:"12px",
padding:"8px 14px",
color:"white",
cursor:"pointer",
fontWeight:"600"
}}
>
🛒 {cart.length}
</button>



{/* ACCOUNT */}

<div ref={dropdownRef} style={{position:"relative"}}>

<button
onClick={()=>setDropdown(!dropdown)}
style={{
width:"42px",
height:"42px",
borderRadius:"50%",
border:"1px solid rgba(255,255,255,.12)",
background:"rgba(255,255,255,.05)",
color:"white",
cursor:"pointer",
fontSize:"18px"
}}
>
👤
</button>



{/* 🔥 DROPDOWN */}

{dropdown && (

<div style={{
position:"absolute",
right:0,
top:"55px",
background:"rgba(2,6,23,.95)",
backdropFilter:"blur(20px)",
border:"1px solid rgba(34,197,94,.18)",
borderRadius:"14px",
padding:"10px",
width:"200px",
boxShadow:"0 20px 60px rgba(0,0,0,.6)"
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
<button
onClick={()=>window.location.href="/track"}
style={dropdownBtn}
>
Track Order
</button>

<button
onClick={()=>signOut(auth)}
style={dropdownBtn}
>
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
padding:"12px",
background:"transparent",
border:"none",
color:"white",
cursor:"pointer",
textAlign:"left" as const,
borderRadius:"8px",
fontWeight:"600"
};
