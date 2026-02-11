'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs,addDoc } from "firebase/firestore";

export default function AdminDashboard(){

const [orders,setOrders] = useState(0);
const [revenue,setRevenue] = useState(0);
const [products,setProducts] = useState(0);

useEffect(()=>{

async function load(){

const ordersSnap = await getDocs(collection(db,"orders"));
const productsSnap = await getDocs(collection(db,"products"));

let total = 0;

ordersSnap.forEach((doc:any)=>{
total += doc.data().total || 0;
});

setOrders(ordersSnap.size);
setRevenue(total);
setProducts(productsSnap.size);
}

load();

},[]);


const card = {
flex:1,
background:"linear-gradient(145deg,#07122a,#020617)",
padding:"35px",
borderRadius:"18px",
border:"1px solid rgba(34,197,94,.15)",
boxShadow:"0 20px 60px rgba(0,0,0,.7)"
};

return(

<div>

<h1 style={{
fontSize:"42px",
fontWeight:"900",
marginBottom:"40px"
}}>
Admin Dashboard
</h1>

<div style={{
display:"flex",
gap:"25px"
}}>

<div style={card}>
<h2>Total Revenue</h2>
<p style={{fontSize:"28px",color:"#22c55e"}}>
₹{revenue}
</p>
</div>

<div style={card}>
<h2>Total Orders</h2>
<p style={{fontSize:"28px"}}>
{orders}
</p>
</div>

<div style={card}>
<h2>Products</h2>
<p style={{fontSize:"28px"}}>
{products}
</p>
</div>

</div>

</div>
);
}
