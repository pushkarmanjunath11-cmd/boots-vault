export default function Footer() {
  return (

    <footer style={{
      marginTop: "80px",
      padding: "40px 20px",
      background: "#05070a",
      borderTop: "1px solid #1a1a1a",
      color: "#9ca3af"
    }}>

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        textAlign: "center"
      }}>

        {/* BRAND */}
        <h2 style={{
          margin: 0,
          color: "white",
          fontSize: "22px",
          letterSpacing: "1px"
        }}>
          Boots Vault
        </h2>

        {/* TAGLINE */}
        <p style={{
          margin: 0,
          fontSize: "14px",
          opacity: 0.7
        }}>
          Premium Football Boots, Jerseys & Gear
        </p>

        {/* CONTACT */}
        <div style={{
          marginTop: "10px",
          fontSize: "14px",
          lineHeight: "1.8"
        }}>
          <div>Email: pushkarmanjunath11@gmail.com</div>
          <div>WhatsApp: +91 7996097779</div>
        </div>

        {/* DIVIDER */}
        <div style={{
          width: "100%",
          height: "1px",
          background: "#1a1a1a",
          margin: "20px 0"
        }}/>

        {/* COPYRIGHT */}
        <p style={{
          margin: 0,
          fontSize: "13px",
          opacity: 0.6
        }}>
          © {new Date().getFullYear()} Boots Vault. All rights reserved.
        </p>

      </div>

    </footer>
  );
}
