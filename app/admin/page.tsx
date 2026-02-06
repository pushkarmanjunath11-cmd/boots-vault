'use client';

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AdminPage(){

const [image,setImage] = useState("");
const bootSizes = [6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11];
const [name,setName] = useState("");
const [category,setCategory] = useState("boots");
const [price,setPrice] = useState("");
const [sizes,setSizes] = useState(
  Object.fromEntries(bootSizes.map(size => [size,""]))
);


async function addProduct(){

if(!name || !price){
alert("Fill all fields!");
return;
}

await addDoc(collection(db,"products"),{
name,
price:Number(price),
category,
image,
sizes:Object.fromEntries(
  bootSizes.map(size=>[
    size,
    Number(sizes[size]) || 0
  ])
),
createdAt: new Date()
});

alert("✅ Product Added!");

setName("");
setPrice("");
setSizes(
  Object.fromEntries(
    bootSizes.map(size => [size,""])
  )
);
}

return(

<div style={{padding:"40px"}}>

<h1>OWNER DASHBOARD</h1>

<div style={{
display:"flex",
flexDirection:"column",
gap:"10px",
maxWidth:"400px"
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
borderRadius:"8px",
border:"1px solid rgba(255,255,255,0.1)",
outline:"none",
width:"100%"
}}
>

<option value="">Select Category</option>
<option value="boots">Boots</option>
<option value="jerseys">Jerseys</option>
<option value="gloves">Gloves</option>
<option value="jackets">Jackets</option>
<option value="balls">Balls</option>
<option value="gear">Gear & Essentials</option>

</select>

<input
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>

<input
placeholder="Image URL"
value={image}
onChange={(e)=>setImage(e.target.value)}
/>

<h3>Sizes</h3>

{bootSizes.map((size)=>(
  <input
    key={size}
    placeholder={`Size ${size} stock`}
    value={sizes[size]}
    onChange={(e)=>
      setSizes({...sizes,[size]:e.target.value})
    }
  />
))}

<button onClick={addProduct}>
Add Product
</button>

</div>

</div>
);
}
