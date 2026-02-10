'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AdminPage(){

const sizeMap:any = {
boots:["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11"],
jerseys:["S","M","L","XL"],
gloves:["7","8","9","10"],
jackets:["S","M","L","XL"],
balls:["3","4","5"],
gear:["Standard"]
};

const [name,setName] = useState("");
const [price,setPrice] = useState("");
const [category,setCategory] = useState("boots");
const [featured,setFeatured] = useState(false);
const [sizes,setSizes] = useState<Record<string,number>>({});
const [images,setImages] = useState<string[]>([""]);

useEffect(()=>{

const selectedSizes = sizeMap[category];

const emptyStock = Object.fromEntries(
selectedSizes.map((size:string)=>[size,0])
);

setSizes(emptyStock);

},[category]);


async function addProduct(){

const cleanImages = images.filter(img => img.trim() !== "");

if(!name || !price || cleanImages.length === 0){
alert("Fill all fields!");
return;
}

const formattedSizes = Object.fromEntries(
Object.entries(sizes).map(([size,qty])=>[
size,
Number(qty) || 0
])
);

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

setName("");
setPrice("");
setFeatured(false);
setCategory("boots");
setImages([""]);
}

return(

<div style={{
maxWidth:"750px",
margin:"auto",
background:"#07122a",
padding:"45px",
borderRadius:"22px",
boxShadow:"0 40px 120px rgba(0,0,0,.8)",
border:"1px solid rgba(34,197,94,.15)"
}}>

<h1 style={{
fontWeight:"900",
marginBottom:"25px"
}}>
Add New Product
</h1>

<div style={{
display:"flex",
flexDirection:"column",
gap:"16px"
}}>

<input placeholder="Product Name"
value={name}
onChange={(e)=>setName(e.target.value)}
style={input}
/>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
style={input}
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
style={input}
/>

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
style={input}
/>

))}

<button
onClick={()=>setImages([...images,""])}
style={secondaryBtn}
>
+ Add Another Image
</button>

<label style={{marginTop:"10px"}}>
<input
type="checkbox"
checked={featured}
onChange={(e)=>setFeatured(e.target.checked)}
/>
 Featured Product
</label>

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
style={input}
/>

))}

<button
onClick={addProduct}
style={primaryBtn}
>
Add Product
</button>

</div>

</div>
);
}

const input = {
padding:"14px",
borderRadius:"10px",
border:"1px solid rgba(255,255,255,.08)",
background:"#020617",
color:"white"
};

const primaryBtn = {
padding:"16px",
background:"#22c55e",
border:"none",
borderRadius:"14px",
fontWeight:"800",
fontSize:"16px",
cursor:"pointer"
};

const secondaryBtn = {
padding:"10px",
background:"#111",
border:"1px solid rgba(255,255,255,.1)",
borderRadius:"10px",
cursor:"pointer"
};
