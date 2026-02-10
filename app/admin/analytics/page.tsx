'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Analytics(){

const [revenue,setRevenue] = useState(0);
const [orders,setOrders] = useState(0);

useEffect(()=>{

async function load(){

const snap = await getDocs(collection(db,"orders"));

let total = 0;

snap.forEach(doc=>{
total += doc.data().total || 0;
});

setRevenue(total);
setOrders(snap.size);
}

load();

},[]);

return(

<div>

<h1 style={{fontWeight:"900"}}>
Analytics
</h1>

<div style={{
display:"flex",
gap:"30px",
marginTop:"30px"
}}>

<div style={card}>
<h2>₹{revenue}</h2>
<p>Total Revenue</p>
</div>

<div style={card}>
<h2>{orders}</h2>
<p>Total Orders</p>
</div>

</div>

</div>
);
}

const card = {
background:"linear-gradient(145deg,#07122a,#020617)",
padding:"40px",
borderRadius:"18px",
border:"1px solid rgba(34,197,94,.15)",
minWidth:"220px"
};
