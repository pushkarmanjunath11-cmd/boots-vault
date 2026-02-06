'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProductPage() {

const params = useParams(); // ✅ THIS is the fix
const id = params.id as string;

const [product,setProduct] = useState<any>(null);

useEffect(()=>{

if(!id) return;

async function fetchProduct(){

const docRef = doc(db,"products",id);
const docSnap = await getDoc(docRef);

if(docSnap.exists()){
setProduct(docSnap.data());
}else{
console.log("Product NOT FOUND");
}

}

fetchProduct();

},[id]);

if(!product) return <h1>Loading...</h1>;

return(

<div style={{padding:"40px"}}>

<h1>{product.name}</h1>
<h2>${product.price}</h2>

<h3>Select Size</h3>

<div style={{display:"flex",gap:"10px"}}>

{Object.entries(product.sizes).map(([size,stock]:any)=>(

<button
key={size}
disabled={stock === 0}
style={{
padding:"10px",
background: stock === 0 ? "gray" : "black",
color:"white",
cursor: stock === 0 ? "not-allowed":"pointer"
}}
>

{size} {stock === 0 && "(Out of stock)"}

</button>

))}

</div>

</div>

);
}
