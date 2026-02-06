'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "./context/CartContext";

type Product = {
id: string;
name: string;
price: number;
image: string;
stock: number;
category: string;
};

export default function Home() {

const [products,setProducts] = useState<any[]>([]);
const [selectedCategory, setSelectedCategory] = useState("all");
const { cart, setCart } = useCart();

useEffect(()=>{

async function fetchProducts(){

const querySnapshot = await getDocs(collection(db,"products"));

const productList = querySnapshot.docs.map(doc=>({
id: doc.id,
...doc.data()
}));

setProducts(productList);
}

fetchProducts();

},[]);

return(

<div style={{padding:"40px"}}>

<div style={{
background:"#0f1115",
color:"#fff",
display:"flex",
justifyContent:"center",
gap:"40px",
padding:"10px",
fontSize:"14px",
borderBottom:"1px solid rgba(255,255,255,0.05)"
}}>

<span>🚚 Fast Delivery</span>
<span>✔ Authentic Products</span>
<span>💬 WhatsApp Support</span>
<span>🔁 Easy Returns</span>

</div>

<div style={{
height:"280px",
background:"linear-gradient(135deg, #111, #222)",
color:"white",
display:"flex",
flexDirection:"column",
justifyContent:"center",
padding:"60px"
}}>

<h1 style={{
fontSize:"64px",
margin:0,
fontWeight:"800"
}}>
Dominate The Pitch
</h1>

<p style={{
fontSize:"20px",
opacity:0.8,
marginTop:"10px"
}}>
Elite Football Boots. Built for Speed.
</p>

<div style={{display:"flex", gap:"20px", marginTop:"20px"}}>

<button
style={{
padding:"14px 28px",
borderRadius:"10px",
background:"white",
color:"black",
fontWeight:"600",
border:"none",
cursor:"pointer",
transition:"0.2s"
}}
>
Shop Boots
</button>

<button
style={{
padding:"14px 28px",
borderRadius:"10px",
background:"transparent",
border:"1px solid white",
color:"white",
fontWeight:"600",
cursor:"pointer",
transition:"0.2s"
}}
>
View All Gear
</button>

<p style={{opacity:0.7, marginTop:"18px"}}>
Trusted by footballers across India ⚽
</p>

</div>

</div>

<h2 style={{
fontSize:"32px",
fontWeight:"700",
marginTop:"60px",
marginBottom:"20px",
paddingLeft:"40px"
}}>
Featured Boots
</h2>

<div style={{
display:"flex",
gap:"12px",
padding:"20px 40px",
flexWrap:"wrap"
}}>

{["all","boots","jerseys","gloves","jackets","balls","gear"].map((cat)=>(
<button
key={cat}
onClick={()=>setSelectedCategory(cat)}

onMouseEnter={(e)=>{
if(selectedCategory!==cat){
e.currentTarget.style.background="#1a1f2b";
}
}}

onMouseLeave={(e)=>{
if(selectedCategory!==cat){
e.currentTarget.style.background="transparent";
}
}}

style={{
padding:"10px 20px",
borderRadius:"999px",
border:"1px solid rgba(255,255,255,0.08)",
cursor:"pointer",
background:selectedCategory===cat ? "#ffffff" : "transparent",
color:selectedCategory===cat ? "#000" : "#fff",
fontWeight:"600",
letterSpacing:"0.3px",
transition:"all 0.25s ease"
}}
>
{cat.toUpperCase()}
</button>
))}

</div>

<div style={{
maxWidth:"1200px",
margin:"0 auto"
}}>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))",
gap:"28px"
}}>

{products
.filter((product)=>
selectedCategory==="all"
? true
: product.category===selectedCategory
)
.map((product)=>(

<Link href={`/product/${product.id}`} key={product.id}>

<div style={{
padding:"16px",
borderRadius:"14px",
cursor:"pointer",
background:"#0f1115",
boxShadow:"0 10px 30px rgba(0,0,0,0.08)",
transition:"all 0.25s ease",
overflow:"hidden",
border:"none"
}}

onMouseEnter={(e)=>{
e.currentTarget.style.transform="translateY(-3px)";
e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.35)";

const img = e.currentTarget.querySelector("img");
if(img){
img.style.transform="scale(1.06)";
}
}}

onMouseLeave={(e)=>{
e.currentTarget.style.transform="translateY(0px)";
e.currentTarget.style.boxShadow="0 10px 30px rgba(0,0,0,0.25)";

const img = e.currentTarget.querySelector("img");
if(img){
img.style.transform="scale(1)";
}
}}>

<img
src={product.image}
style={{
width:"100%",
height:"320px",
objectFit:"contain",
background:"#0f1115",
borderRadius:"12px",
transition:"transform 0.4s ease"
}}
/>

<h3 style={{
color:"#ffffff",
fontSize:"18px",
marginTop:"12px"
}}>
{product.name}
</h3>

<p style={{
color:"#9ca3af",
fontWeight:"600",
marginTop:"6px"
}}>
₹{product.price}
</p>

<button
disabled={product.stock === 0}
onClick={(e)=>{
e.preventDefault(); // stops Link navigation
setCart([...cart, product]);
}}

style={{
marginTop:"10px",
width:"100%",
padding:"10px",
background: product.stock === 0 ? "#444" : "#fff",
color: product.stock === 0 ? "#999" : "#000",
border:"none",
borderRadius:"8px",
fontWeight:"600",
cursor: product.stock === 0 ? "not-allowed" : "pointer"
}}
>
{product.stock === 0 ? "Out of Stock" : "Add to Cart"}
</button>

</div>

</Link>

))}

</div>
</div>
</div>
);
}
