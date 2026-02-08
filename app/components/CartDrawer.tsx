'use client';

import { useCart } from "../context/CartContext";

export default function CartDrawer({open,setOpen}:any){

const {cart,removeFromCart,total} = useCart();

return(

<div style={{
position:"fixed",
top:0,
right: open ? "0":"-420px",
width:"420px",
maxWidth:"100%",
height:"100vh",
background:"#0b0d11",
padding:"20px",
transition:"0.35s",
zIndex:9999,
display:"flex",
flexDirection:"column"
}}>

{/* HEADER */}

<div style={{
display:"flex",
justifyContent:"space-between"
}}>
<h2 style={{color:"white"}}>Cart</h2>

<button
onClick={()=>setOpen(false)}
style={{
background:"none",
border:"none",
color:"white",
fontSize:"22px",
cursor:"pointer"
}}>
✕
</button>

</div>


{/* ITEMS */}

<div style={{flex:1,overflowY:"auto"}}>

{cart.length===0 && (
<p style={{color:"#aaa"}}>Cart is empty</p>
)}

{cart.map(item=>(

<div key={item.id+item.selectedSize}
style={{marginBottom:"18px"}}
>

<p style={{color:"white"}}>
{item.name}
</p>

{item.selectedSize && (
<p style={{color:"#aaa"}}>
Size: {item.selectedSize}
</p>
)}

<p style={{color:"#22c55e"}}>
₹{item.price} x {item.quantity}
</p>

<button
onClick={()=>removeFromCart(item.id,item.selectedSize)}
style={{
background:"red",
border:"none",
color:"white",
padding:"6px 10px",
borderRadius:"6px",
cursor:"pointer"
}}>
Remove
</button>

</div>

))}

</div>


{/* FOOTER */}

<div>

<h3 style={{color:"white"}}>
Total: ₹{total}
</h3>

<button style={{
width:"100%",
padding:"14px",
background:"#22c55e",
border:"none",
borderRadius:"10px",
fontWeight:"700",
cursor:"pointer"
}}>
Checkout
</button>

</div>

</div>
);
}
