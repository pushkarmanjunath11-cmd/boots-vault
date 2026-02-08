'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AdminPage(){

/* ---------------- SIZE MAP ---------------- */

const sizeMap:any = {
boots:["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11"],
jerseys:["S","M","L","XL"],
gloves:["7","8","9","10"],
jackets:["S","M","L","XL"],
balls:["3","4","5"],
gear:["Standard"]
};

/* ---------------- STATE ---------------- */

const [name,setName] = useState("");
const [price,setPrice] = useState("");
const [category,setCategory] = useState("boots");
const [featured,setFeatured] = useState(false);
const [sizes,setSizes] = useState<Record<string,number>>({});
const [images,setImages] = useState<string[]>([""]);


/* ---------------- AUTO SIZE RESET ---------------- */

useEffect(()=>{

const selectedSizes = sizeMap[category];

const emptyStock = Object.fromEntries(
selectedSizes.map((size:string)=>[size,0])
);

setSizes(emptyStock);

},[category]);



/* ---------------- ADD PRODUCT ---------------- */

async function addProduct(){

const cleanImages = images.filter(img => img.trim() !== "");

if(!name || !price || cleanImages.length === 0){
alert("Fill all fields!");
return;
}

/* format sizes safely */

const formattedSizes = Object.fromEntries(
Object.entries(sizes).map(([size,qty])=>[
size,
Number(qty) || 0
])
);

/* stop zero stock */

if(Object.values(formattedSizes).every(qty => qty <= 0)){
alert("Add stock before creating product");
return;
}

await addDoc(collection(db,"products"),{
name,
price:Number(price),
images: cleanImages,
category,
sizes:formattedSizes,
featured,
createdAt:new Date()
});

alert("✅ Product Added!");

/* -------- RESET FORM -------- */

setName("");
setPrice("");
setFeatured(false);
setCategory("boots"); 
setImages([""]);   // resets image inputs

// sizes auto reset via useEffect
}


/* ---------------- UI ---------------- */

return(

<div style={{
padding:"40px",
color:"white",
minHeight:"100vh"
}}>

<h1>OWNER DASHBOARD</h1>

<div style={{
display:"flex",
flexDirection:"column",
gap:"12px",
maxWidth:"420px"
}}>

<input
placeholder="Product Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
style={{
background:"#111",
color:"#fff",
padding:"10px",
borderRadius:"8px"
}}
>

<option value="boots">Boots</option>
<option value="jerseys">Jerseys</option>
<option value="gloves">Gloves</option>
<option value="jackets">Jackets</option>
<option value="balls">Balls</option>
<option value="gear">Gear</option>

</select>

<input
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>


{/* ---------- IMAGES ---------- */}

<h3>Product Images</h3>

{images.map((img,index)=>(

<input
key={index}
placeholder={`Image ${index+1} URL`}
value={img}
onChange={(e)=>{
const updated = [...images];
updated[index] = e.target.value;
setImages(updated);
}}
/>

))}

<button
onClick={()=>setImages([...images,""])}
style={{padding:"6px"}}
>
+ Add Another Image
</button>



{/* ---------- FEATURED ---------- */}

<label>
<input
type="checkbox"
checked={featured}
onChange={(e)=>setFeatured(e.target.checked)}
/>
 Featured Product
</label>



{/* ---------- STOCK ---------- */}

<h3>Stock</h3>

{Object.keys(sizes).map(size => (

<input
key={size}
placeholder={`Size ${size}`}
value={sizes[size] || ""}
onChange={(e)=>
setSizes({
...sizes,
[size]:Number(e.target.value)
})
}
/>

))}



<button
onClick={addProduct}
style={{
padding:"12px",
background:"#22c55e",
border:"none",
borderRadius:"10px",
fontWeight:"700",
cursor:"pointer"
}}
>
Add Product
</button>

</div>
</div>
);
}
