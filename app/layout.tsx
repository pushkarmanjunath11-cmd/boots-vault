import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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

<CartProvider>

<Navbar />

{children}

<Footer />

</CartProvider>

</body>
</html>
 );
}