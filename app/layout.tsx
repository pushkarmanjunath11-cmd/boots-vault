import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet"/>
<body style={{fontFamily:"Inter, sans-serif"}}>

<CartProvider>

<Navbar />

{children}

<Footer />

</CartProvider>

</body>
</html>
 );
}