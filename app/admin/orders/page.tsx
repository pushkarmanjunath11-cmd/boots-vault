'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
collection,
getDocs,
doc,
updateDoc
} from "firebase/firestore";

export default function OrdersPage(){

const [orders,setOrders] = useState<any[]>([]);

useEffect(()=>{

async function fetchOrders(){

const snapshot = await getDocs(collection(db,"orders"));

const list = snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setOrders(list);
}

fetchOrders();

},[]);


/* 🔥 CHANGE STATUS */

async function changeStatus(id:string,status:string){

await updateDoc(doc(db,"orders",id),{
status
});

setOrders(prev =>
prev.map(o =>
o.id === id ? {...o,status} : o
));

}


return(

<div>

<h1 style={{marginBottom:"30px"}}>
Orders
</h1>

{orders.map(order=>(

<div key={order.id}
style={{
background:"linear-gradient(145deg,#07122a,#020617)",
border:"1px solid rgba(34,197,94,.15)",
boxShadow:"0 20px 60px rgba(0,0,0,.6)",
padding:"20px",
borderRadius:"14px",
marginBottom:"20px"
}}
>

<h3>₹{order.total}</h3>

<p>Status: 
<span style={{
color:
order.status === "Delivered"
? "#22c55e"
: order.status === "Shipped"
? "#60a5fa"
: "#facc15"
}}>
</span>
</p>

<select
value={order.status}
onChange={(e)=>changeStatus(order.id,e.target.value)}
style={{
padding:"8px",
borderRadius:"6px",
marginTop:"10px"
}}
>
<option>Processing</option>
<option>Shipped</option>
<option>Out for Delivery</option>
<option>Delivered</option>
</select>


<div style={{marginTop:"15px"}}>

{order.items.map((item:any)=>(
<p key={item.name}>
• {item.name} — Size {item.size}
</p>
))}

</div>

</div>

))}

</div>
);
}
