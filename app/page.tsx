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

const {addToCart} = useCart();

/* POPUP STATE */
const [popupProduct,setPopupProduct] = useState<Product | null>(null);
const [selectedSize,setSelectedSize] = useState<string | null>(null);

/* FETCH */

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


/* STOCK CHECK */

function isOut(product:Product){

if(!product.sizes) return true;

return Object.values(product.sizes)
.every((qty:number)=> qty <= 0);

}


/* FILTER */

const filtered = products.filter(product=>{

if(selectedCategory === "all"){
return product.featured === true;
}

return product.category === selectedCategory;

});


/* UI */

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

{filtered.map(product=>{

const out = isOut(product);

return(

<div key={product.id} style={{
background:"#11151c",
padding:"14px",
borderRadius:"12px"
}}>

<Link href={`/product/${product.id}`}>

<img
src={product.images?.[0] || product.image}
style={{
width:"100%",
height:"180px",
objectFit:"contain",
cursor:"pointer"
}}
/>

</Link>

<h3 style={{color:"#fff"}}>
{product.name}
</h3>

<p style={{color:"#9ca3af"}}>
₹{product.price}
</p>

<button
disabled={out}
onClick={()=>{
setPopupProduct(product);
setSelectedSize(null);
}}
style={{
marginTop:"6px",
width:"100%",
padding:"10px",
borderRadius:"8px",
border:"none",
background: out ? "#333" : "#22c55e",
color:"white",
cursor:"pointer"
}}
>

{out ? "Out of Stock":"Add To Cart"}

</button>

</div>

);

})}

</div>


{/* SIZE POPUP */}

{popupProduct && (

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,.75)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:9999
}}>

<div style={{
background:"#0f172a",
padding:"30px",
borderRadius:"16px",
width:"420px",
maxWidth:"95%"
}}>

<img
src={popupProduct.images?.[0] || popupProduct.image}
style={{
width:"100%",
borderRadius:"10px",
marginBottom:"10px"
}}
/>

<h2 style={{color:"white"}}>
{popupProduct.name}
</h2>

<p style={{color:"#22c55e"}}>
₹{popupProduct.price}
</p>

<h3 style={{color:"white"}}>Select Size</h3>

<div style={{
display:"flex",
flexWrap:"wrap",
gap:"10px",
marginBottom:"20px"
}}>

{Object.entries(popupProduct.sizes || {}).map(([size,stock]:any)=>{

const out = Number(stock) <= 0;

return(

<button
key={size}
disabled={out}
onClick={()=>setSelectedSize(size)}
style={{
padding:"10px 14px",
borderRadius:"8px",
border:selectedSize===size
? "2px solid #22c55e"
: "1px solid #333",
background:"#111",
color:"white",
cursor:"pointer"
}}
>

{size}

</button>

);

})}

</div>


<button
disabled={!selectedSize}
onClick={()=>{

addToCart(
{
  id: popupProduct.id,
  name: popupProduct.name,
  price: popupProduct.price,
  image: popupProduct.images?.[0] || popupProduct.image || "",
  size: selectedSize!   // ⭐ THIS WAS MISSING
},
);

setPopupProduct(null);

}}
style={{
width:"100%",
padding:"14px",
background:selectedSize ? "#22c55e":"#333",
border:"none",
borderRadius:"10px",
fontWeight:"700",
cursor:"pointer"
}}
>

Add To Cart

</button>


<button
onClick={()=>setPopupProduct(null)}
style={{
marginTop:"10px",
width:"100%",
padding:"10px",
background:"transparent",
border:"1px solid #444",
color:"white",
borderRadius:"10px"
}}
>
Cancel
</button>

</div>

</div>

)}

</div>
);
}