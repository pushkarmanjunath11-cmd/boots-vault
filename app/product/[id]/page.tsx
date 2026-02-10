'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "@/app/context/CartContext";
import { Product } from "@/types/Product";

export default function Home(){

const [products,setProducts] = useState<Product[]>([]);
const [selectedCategory,setSelectedCategory] = useState("all");

const {addToCart} = useCart();

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


/* STOCK */

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


return(

<div style={{
padding:"40px",
background:"linear-gradient(180deg,#020617,#020617,#000)",
minHeight:"100vh"
}}>


{/* HERO */}

<div style={{
padding:"70px 40px",
borderRadius:"20px",
background:"linear-gradient(135deg,#020617,#07122a)",
color:"white",
marginBottom:"40px",
border:"1px solid rgba(34,197,94,.15)"
}}>

<h1 style={{
fontSize:"clamp(36px,6vw,64px)",
margin:0,
fontWeight:"800",
letterSpacing:"-1px"
}}>
Dominate The Pitch ⚡
</h1>

<p style={{
opacity:.7,
marginTop:"10px",
fontSize:"18px"
}}>
India’s Premium Football Store
</p>

</div>


{/* TRUST BAR */}

<div style={{
display:"flex",
justifyContent:"center",
gap:"40px",
flexWrap:"wrap",
marginBottom:"50px",
padding:"18px",
background:"rgba(15,23,42,.6)",
backdropFilter:"blur(12px)",
borderRadius:"14px",
fontWeight:"600",
border:"1px solid rgba(34,197,94,.12)"
}}>

<span>✅ UPI Accepted</span>
<span>💬 WhatsApp Orders</span>
<span>🚚 Ships Across India</span>
<span>🔒 Secure Ordering</span>

</div>



{/* CATEGORY */}

<div style={{
display:"flex",
gap:"14px",
flexWrap:"wrap",
marginBottom:"60px"
}}>

{["all","boots","jerseys","gloves","jackets","balls","gear"].map(cat=>(

<button
key={cat}
onClick={()=>setSelectedCategory(cat)}
style={{
padding:"10px 22px",
borderRadius:"999px",
border:"1px solid rgba(34,197,94,.25)",
background:selectedCategory===cat
? "#22c55e"
: "transparent",
color:selectedCategory===cat
? "#000"
: "#9ca3af",
cursor:"pointer",
fontWeight:"700"
}}
>
{cat.toUpperCase()}
</button>

))}

</div>



{/* GRID */}

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:"28px"
}}
>

{filtered.map(product=>{

const out = isOut(product);

return(

<div key={product.id}

style={{
background:"linear-gradient(145deg,#020617,#020617,#07122a)",
padding:"20px",
borderRadius:"18px",
border:"1px solid rgba(34,197,94,.15)",
transition:"0.3s",
boxShadow:"0 10px 40px rgba(0,0,0,.6)"
}}

onMouseEnter={(e)=>{
e.currentTarget.style.transform="translateY(-8px)";
}}

onMouseLeave={(e)=>{
e.currentTarget.style.transform="translateY(0px)";
}}

>

<Link href={`/product/${product.id}`}>

<img
src={product.images?.[0] || product.image}
style={{
width:"100%",
height:"190px",
objectFit:"contain"
}}
/>

</Link>

<h3 style={{color:"#fff"}}>
{product.name}
</h3>

<p style={{color:"#22c55e",fontWeight:"700"}}>
₹{product.price}
</p>

<button
disabled={out}
onClick={()=>{
setPopupProduct(product);
setSelectedSize(null);
}}
style={{
marginTop:"10px",
width:"100%",
padding:"12px",
borderRadius:"10px",
border:"none",
background: out ? "#111" : "#22c55e",
color: out ? "#555" : "#000",
fontWeight:"700",
cursor:"pointer"
}}
>

{out ? "Out of Stock":"Add To Cart"}

</button>

</div>

);

})}

</div>



{/* POPUP */}

{popupProduct && (

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,.8)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:9999
}}>

<div style={{
background:"#020617",
padding:"30px",
borderRadius:"18px",
width:"420px",
maxWidth:"95%",
border:"1px solid rgba(34,197,94,.2)"
}}>

<img
src={popupProduct.images?.[0] || popupProduct.image}
style={{
width:"100%",
borderRadius:"10px",
marginBottom:"12px"
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
background:"#020617",
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

addToCart({
id: popupProduct.id,
name: popupProduct.name,
price: popupProduct.price,
image: popupProduct.images?.[0] || popupProduct.image || "",
size: selectedSize!
});

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

</div>

</div>

)}

</div>
);
}