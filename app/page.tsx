'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "./context/CartContext";
import { Product } from "@/types/Product";

export default function Home(){

const [products,setProducts] = useState<Product[]>([]);
const [selectedCategory,setSelectedCategory] = useState("all");
const {cart, addToCart, removeFromCart} = useCart();

/* ---------- FETCH ---------- */

useEffect(()=>{

async function fetchProducts(){

const snapshot = await getDocs(collection(db,"products"));

const list = snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
})) as Product[];

setProducts(list);
}

fetchProducts();

},[]);


/* ---------- STOCK CHECK ---------- */

function isOutOfStock(product:Product){

if(!product.sizes) return true;

return Object.values(product.sizes).every((qty:number)=> qty <= 0);

}


/* ---------- FILTER ---------- */

const filteredProducts = products.filter(product=>{

if(selectedCategory === "all"){
return product.featured === true;
}

return product.category === selectedCategory;

});


/* ---------- UI ---------- */

return(

<div style={{
padding:"20px",
background:"#0b0d11",
minHeight:"100vh"
}}>

{/* HERO */}

<div style={{
padding:"40px 20px",
borderRadius:"14px",
background:"linear-gradient(135deg,#111,#1a1f2b)",
color:"white",
marginBottom:"30px"
}}>

<h1 style={{
fontSize:"clamp(28px,5vw,52px)",
margin:0
}}>
Dominate The Pitch
</h1>

<p style={{opacity:0.7}}>
Elite Football Boots Built For Speed ⚡
</p>

</div>


{/* CATEGORY */}

<div style={{
display:"flex",
gap:"10px",
flexWrap:"wrap",
marginBottom:"25px"
}}>

{["all","boots","jerseys","gloves","jackets","balls","gear"].map(cat=>(

<button
key={cat}
onClick={()=>setSelectedCategory(cat)}
style={{
padding:"8px 16px",
borderRadius:"999px",
border:"1px solid #222",
background:selectedCategory===cat ? "#fff" : "transparent",
color:selectedCategory===cat ? "#000" : "#aaa",
cursor:"pointer"
}}
>
{cat.toUpperCase()}
</button>

))}

</div>


{/* GRID */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))",
gap:"18px"
}}>

{filteredProducts.map(product=>{

const out = isOutOfStock(product);

return(

<Link href={`/product/${product.id}`} key={product.id}>

<div style={{
background:"#11151c",
padding:"14px",
borderRadius:"12px",
cursor:"pointer"
}}>

<img
src={product.images?.[0] || product.image}
style={{
width:"100%",
height:"180px",
objectFit:"contain"
}}
/>

<h3 style={{
color:"#fff",
fontSize:"15px"
}}>
{product.name}
</h3>

<p style={{color:"#9ca3af"}}>
₹{product.price}
</p>

<button
disabled={out}
onClick={(e)=>{
e.preventDefault();
if(out) return;
addToCart(product);
}}
style={{
marginTop:"6px",
width:"100%",
padding:"8px",
borderRadius:"6px",
border:"none",
background: out ? "#1a1a1a" : "#ffffff",
color: out ? "#666" : "#000",
opacity: out ? 0.6 : 1,
cursor:out ? "not-allowed":"pointer"
}}
>

{out ? "Out of Stock":"Add To Cart"}

</button>

</div>

</Link>

);

})}

</div>

</div>
);
}
