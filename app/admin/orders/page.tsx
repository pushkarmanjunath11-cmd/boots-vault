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
fetchOrders();
},[]);

async function fetchOrders(){

const snapshot = await getDocs(collection(db,"orders"));

const list = snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setOrders(list);
}


/* ✅ UPDATE STATUS — NOT CREATE ORDER */

async function updateStatus(id:string,status:string){

const ref = doc(db,"orders",id);

await updateDoc(ref,{
status
});

setOrders(prev =>
prev.map(o =>
o.id === id ? {...o,status} : o
)
);

}

return(

<div style={{
padding:"40px",
background:"#020617",
minHeight:"100vh",
color:"white"
}}>

<h1 style={{fontSize:"32px",fontWeight:"800"}}>
Orders Dashboard
</h1>

{orders.map(order=>(

<div key={order.id}
style={{
background:"#07122a",
padding:"25px",
borderRadius:"16px",
marginTop:"25px",
border:"1px solid rgba(34,197,94,.2)"
}}
>

<h2>Invoice: {order.invoice}</h2>

<p>
Customer: {order.email}
</p>

<p>
Total: ₹{order.total}
</p>

<p>
Status:
<span style={{
color:"#22c55e",
marginLeft:"8px",
fontWeight:"700"
}}>
{order.status}
</span>
</p>


{/* ITEMS */}

<div style={{marginTop:"10px"}}>
{order.items?.map((item:any)=>(
<p key={item.name}>
• {item.name} — Size {item.size}
</p>
))}
</div>


{/* STATUS BUTTONS */}

<div style={{
display:"flex",
gap:"10px",
marginTop:"20px"
}}>

<button onClick={()=>updateStatus(order.id,"Processing")}>
Processing
</button>

<button onClick={()=>updateStatus(order.id,"Shipped")}>
Shipped
</button>

<button onClick={()=>updateStatus(order.id,"Delivered")}>
Delivered
</button>

</div>

</div>

))}

</div>
);
}
