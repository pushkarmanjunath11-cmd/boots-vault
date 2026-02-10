'use client';

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage(){

async function loginGoogle(){

const provider = new GoogleAuthProvider();

await signInWithPopup(auth, provider);

alert("Logged in successfully!");

}

return(

<div style={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#020617",
color:"white"
}}>

<div style={{
background:"#0f172a",
padding:"50px",
borderRadius:"16px",
width:"380px",
textAlign:"center",
boxShadow:"0 20px 60px rgba(0,0,0,.6)"
}}>

<h1>Boots Vault</h1>

<p style={{opacity:.7}}>
Login to track orders & checkout faster
</p>

<button
onClick={loginGoogle}
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