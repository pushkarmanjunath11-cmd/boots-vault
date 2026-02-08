'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "@/app/context/CartContext";

export default function ProductPage() {

const params = useParams();
const id = params.id as string;

const [product,setProduct] = useState<any>(null);
const [selectedSize,setSelectedSize] = useState<string | null>(null);
const { cart, setCart } = useCart();

useEffect(()=>{

async function fetchProduct(){

const docRef = doc(db,"products",id);
const snap = await getDoc(docRef);

if(snap.exists()){
setProduct(snap.data());
}

}

fetchProduct();

},[id]);

if(!product) return <h1 style={{padding:"40px"}}>Loading...</h1>;

const sizes = product.sizes || {};

return(

<div style={{
padding:"20px",
maxWidth:"1100px",
margin:"auto",
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
gap:"40px"
}}>

{/* IMAGE */}

<img
src={product.image}
style={{
width:"100%",
borderRadius:"16px",
background:"#111",
padding:"20px"
}}
/>

{/* INFO */}

<div>

<h1 style={{marginBottom:"10px"}}>
{product.name}
</h1>

<h2 style={{marginBottom:"20px"}}>
₹{product.price}
</h2>

<h3>Select Size</h3>

<div style={{
display:"flex",
flexWrap:"wrap",
gap:"10px",
marginBottom:"20px"
}}>

{Object.entries(sizes).map(([size,stock]:any)=>(

<button
key={size}
disabled={stock === 0}
onClick={()=>setSelectedSize(size)}
style={{
padding:"12px 16px",
borderRadius:"8px",
border:selectedSize===size
? "2px solid #22c55e"
: "1px solid #333",
background:stock===0 ? "#222":"transparent",
color:"white",
cursor:stock===0 ? "not-allowed":"pointer"
}}
>

{size}

</button>

))}

</div>

<button
disabled={!selectedSize}
onClick={()=>{
setCart([...cart,{
...product,
selectedSize
}]);
}}
style={{
padding:"14px",
width:"100%",
borderRadius:"10px",
border:"none",
fontWeight:"700",
background:selectedSize ? "#22c55e" : "#444",
cursor:selectedSize ? "pointer":"not-allowed"
}}
>

{selectedSize ? "Add To Cart" : "Select Size"}

</button>

</div>

</div>
);
}
