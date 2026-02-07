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
  category: string;
  sizes?: Record<string, number>;
  featured?: boolean;
};

export default function Home() {

const [products,setProducts] = useState<Product[]>([]);
const [selectedCategory, setSelectedCategory] = useState("all");
const { cart, setCart } = useCart();

useEffect(()=>{

async function fetchProducts(){

const querySnapshot = await getDocs(collection(db,"products"));

const productList = querySnapshot.docs.map(doc=>({
id: doc.id,
...doc.data()
})) as Product[];

setProducts(productList);
}

fetchProducts();

},[]);


// ⭐ ONLY FEATURED PRODUCTS
const featuredProducts = products.filter(p => p.featured);


// ⭐ CATEGORY FILTER
const filteredProducts = featuredProducts.filter(product =>
selectedCategory === "all"
? true
: product.category === selectedCategory
);


return (

<div style={{
padding:"20px",
background:"#0b0d11",
minHeight:"100vh"
}}>

{/* TOP STRIP */}
<div style={{
display:"flex",
justifyContent:"center",
gap:"20px",
flexWrap:"wrap",
fontSize:"13px",
color:"#aaa",
marginBottom:"10px"
}}>
<span>🚚 Fast Delivery</span>
<span>✔ Authentic Products</span>
<span>💬 WhatsApp Support</span>
<span>🔁 Easy Returns</span>
</div>


{/* HERO */}
<div style={{
padding:"50px 20px",
borderRadius:"16px",
background:"linear-gradient(135deg,#111,#1a1f2b)",
color:"white",
marginBottom:"40px"
}}>

<h1 style={{
fontSize:"clamp(32px,6vw,60px)",
margin:0,
fontWeight:"800"
}}>
Dominate The Pitch
</h1>

<p style={{
opacity:0.7,
marginTop:"10px"
}}>
Elite Football Boots Built For Speed ⚡
</p>

</div>


{/* CATEGORY FILTER */}
<div style={{
display:"flex",
gap:"10px",
flexWrap:"wrap",
marginBottom:"30px"
}}>

{["all","boots","jerseys","gloves","jackets","balls","gear"].map(cat=>(
<button
key={cat}
onClick={()=>setSelectedCategory(cat)}
style={{
padding:"8px 18px",
borderRadius:"999px",
border:"1px solid #222",
background:selectedCategory===cat ? "#fff" : "transparent",
color:selectedCategory===cat ? "#000" : "#aaa",
cursor:"pointer",
fontWeight:"600"
}}
>
{cat.toUpperCase()}
</button>
))}

</div>



{/* PRODUCT GRID */}
<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))",
gap:"22px"
}}>

{filteredProducts.map(product=>{

// ⭐ STOCK CHECK FROM SIZES
const isOutOfStock = Object.values(product.sizes || {}).every(
qty => Number(qty) === 0
);

return(

<Link href={`/product/${product.id}`} key={product.id}>

<div style={{
background:"#11151c",
padding:"14px",
borderRadius:"14px",
cursor:"pointer",
transition:"0.25s"
}}>

<img
src={product.image}
style={{
width:"100%",
height:"200px",
objectFit:"contain"
}}
/>

<h3 style={{
color:"#fff",
fontSize:"16px",
marginTop:"10px"
}}>
{product.name}
</h3>

<p style={{
color:"#9ca3af",
fontWeight:"600"
}}>
₹{product.price}
</p>


<button
disabled={isOutOfStock}
onClick={(e)=>{
e.preventDefault();
if(isOutOfStock) return;
setCart([...cart, product]);
}}

style={{
marginTop:"8px",
width:"100%",
padding:"10px",
borderRadius:"8px",
border:"none",
fontWeight:"700",
background:isOutOfStock ? "#333" : "#fff",
color:isOutOfStock ? "#777" : "#000",
cursor:isOutOfStock ? "not-allowed" : "pointer"
}}
>

{isOutOfStock ? "Out of Stock" : "Add To Cart"}

</button>

</div>

</Link>

);

})}

</div>

</div>

);
}
