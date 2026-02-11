'use client';

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage(){

const router = useRouter();
const [user,setUser] = useState<any>(null);

async function handleLogin(){

const provider = new GoogleAuthProvider();

const result = await signInWithPopup(auth, provider);

const email = result.user.email;

if(
email === "pushkarmanjunath11@gmail.com" ||
email === "bootsvault.ph@gmail.com"
){
window.location.href="/admin";
}else{
alert("You are not an admin.");
await auth.signOut();
}}

return(

<div style={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#020617"
}}>

<div style={{
background:"#07122a",
padding:"50px",
borderRadius:"16px",
width:"380px",
textAlign:"center",
border:"1px solid rgba(34,197,94,.2)"
}}>

<h1 style={{color:"white"}}>Boots Vault</h1>

<p style={{color:"#9ca3af"}}>
Login in 1 second with Google
</p>

<button
onClick={handleLogin}
style={{
marginTop:"20px",
width:"100%",
padding:"14px",
borderRadius:"10px",
border:"none",
background:"#22c55e",
fontWeight:"700",
cursor:"pointer"
}}
>
Continue with Google
</button>

</div>

</div>
);
}
