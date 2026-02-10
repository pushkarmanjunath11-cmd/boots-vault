'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}:{
  children:React.ReactNode
}){

const pathname = usePathname();

const navItem = (href:string,label:string)=>{

const active = pathname === href;

return(
<Link href={href}
style={{
padding:"14px 18px",
borderRadius:"12px",
textDecoration:"none",
fontWeight:"700",
background: active ? "#22c55e" : "transparent",
color: active ? "#02120a" : "#e5e7eb",
border:"1px solid rgba(34,197,94,.25)",
transition:"0.2s"
}}>
{label}
</Link>
);
};

return(

<div style={{
display:"flex",
minHeight:"100vh",
background:"#020617",
color:"white"
}}>

{/* SIDEBAR */}

<div style={{
width:"260px",
padding:"30px 20px",
borderRight:"1px solid rgba(34,197,94,.15)",
background:"linear-gradient(180deg,#020617,#020617,#000)"
}}>

<h2 style={{
color:"#22c55e",
fontWeight:"900",
letterSpacing:"1px"
}}>
Boots Vault
</h2>

<p style={{
color:"#9ca3af",
fontSize:"13px"
}}>
Admin Dashboard
</p>

<div style={{
display:"flex",
flexDirection:"column",
gap:"14px",
marginTop:"30px"
}}>

{navItem("/admin","➕ New Product")}
{navItem("/admin/orders","📦 Orders")}
{navItem("/admin/analytics","📊 Analytics")}

</div>

</div>


{/* MAIN CONTENT */}

<div style={{
flex:1,
padding:"50px"
}}>
{children}
</div>

</div>
);
}
