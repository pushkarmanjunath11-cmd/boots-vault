'use client';

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function TrackOrders(){

const [user,setUser] = useState<any>(null);
const [orders,setOrders] = useState<any[]>([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{

const unsubscribe = onAuthStateChanged(auth, async(currentUser)=>{

if(!currentUser){
setUser(null);
setLoading(false);
return;
}

setUser(currentUser);

/* LOAD USER ORDERS */

const q = query(
collection(db,"orders"),
where("userId","==",currentUser.uid)
);

const snapshot = await getDocs(q);

const list = snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setOrders(list);
setLoading(false);

});

return ()=> unsubscribe();

},[]);



/* ---------- UI ---------- */

if(loading){
return <h1 style={{padding:"40px"}}>Loading orders...</h1>
}

if(!user){
return(
<div style={{padding:"40px",color:"white"}}>
<h1>Please login to view orders.</h1>
</div>
);
}


return(

<div style={{
padding:"40px",
background:"#020617",
minHeight:"100vh",
color:"white"
}}>

<h1>Your Orders</h1>

{orders.length === 0 && (
<p>No orders yet.</p>
)}

{orders.map(order=>(

<div key={order.id}
style={{
background:"#07122a",
padding:"20px",
borderRadius:"12px",
marginTop:"20px"
}}>

<h3>Order Total: ₹{order.total}</h3>

<p>Status: 
<span style={{
color:
order.status === "Delivered"
? "#22c55e"
: "#facc15"
}}>
{" "}{order.status}
</span>
</p>

{order.items.map((item:any)=>(
<p key={item.name}>
• {item.name} — Size {item.size}
</p>
))}

</div>

))}

</div>
);
}
