'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Product } from "@/types/Product";
import { useCart } from "@/app/context/CartContext";

export default function ProductPage(){

const params = useParams();
const id = params?.id as string;

const { addToCart } = useCart();

const [product,setProduct] = useState<Product | null>(null);
const [selectedImage,setSelectedImage] = useState("");
const [selectedSize,setSelectedSize] = useState<string | null>(null);


/* ---------------- FETCH PRODUCT ---------------- */

useEffect(()=>{

if(!id) return;

async function fetchProduct(){

const ref = doc(db,"products",id);
const snap = await getDoc(ref);

if(snap.exists()){

const data = {
id: snap.id,
...snap.data()
} as Product;

setProduct(data);
setSelectedImage(data.images?.[0] || data.image || "");

}

}

fetchProduct();

},[id]);


/* ---------------- LOADING ---------------- */

if(!product){
return <h1 style={{padding:"40px"}}>Loading...</h1>;
}


/* ---------------- UI ---------------- */

return(

<div style={{
padding:"40px",
color:"white",
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
gap:"40px"
}}>

{/* IMAGE SECTION */}

<div>

<img
src={selectedImage}
style={{
width:"100%",
borderRadius:"16px",
background:"#111",
padding:"20px",
objectFit:"contain"
}}
/>


{/* THUMBNAILS */}

<div style={{
display:"flex",
gap:"10px",
marginTop:"12px",
flexWrap:"wrap"
}}>

{(product.images?.length ? product.images : [product.image]).map((img:any)=>(
<img
key={img}
src={img}
onClick={()=>setSelectedImage(img)}
style={{
width:"70px",
height:"70px",
objectFit:"cover",
borderRadius:"8px",
cursor:"pointer",
border:selectedImage===img
? "2px solid #22c55e"
: "1px solid #333"
}}
/>
))}

</div>

</div>



{/* INFO SECTION */}

<div>

<h1 style={{marginTop:0}}>
{product.name}
</h1>

<h2 style={{color:"#22c55e"}}>
₹{product.price}
</h2>



{/* SIZE SELECTOR */}

<h3>Select Size</h3>

<div style={{
display:"flex",
gap:"10px",
flexWrap:"wrap",
marginBottom:"20px"
}}>

{Object.entries(product.sizes || {}).map(([size,stock]:any)=>{

const out = Number(stock) <= 0;

return(

<button
key={size}
disabled={out}
onClick={()=>setSelectedSize(size)}
style={{
padding:"12px 16px",
borderRadius:"10px",
border:selectedSize===size
? "2px solid #22c55e"
: "1px solid #333",
background: out ? "#222" : "#111",
color:"white",
cursor: out ? "not-allowed":"pointer"
}}
>
{size}
</button>

);

})}

</div>



{/* ADD TO CART */}

<button
disabled={!selectedSize}
onClick={()=>addToCart(product, selectedSize!)}
style={{
width:"100%",
padding:"16px",
background:selectedSize ? "#22c55e" : "#333",
border:"none",
borderRadius:"12px",
fontWeight:"700",
cursor:selectedSize ? "pointer":"not-allowed"
}}
>
{selectedSize ? "Add To Cart":"Select Size First"}
</button>

</div>

</div>
);
}
