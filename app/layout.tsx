import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Boots Vault',
  description: 'Premium Football Boots, Jerseys & Gear',
}

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
<html lang="en">
<body style={{margin:0,fontFamily:"sans-serif"}}>

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginTop:"8px",
padding:"8px 40px",
background:"#0b0d12",
borderBottom:"1px solid rgba(255,255,255,0.05)",
position:"sticky",
top:"0",
zIndex:"999"
}}>

</div>

<CartProvider>

<Navbar />

{children}

</CartProvider>

</body>
</html>
 );
}