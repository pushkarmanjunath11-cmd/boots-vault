import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{ background:'var(--bg2)', borderTop:'1px solid var(--border)', fontFamily:'Montserrat,sans-serif' }}>
      <div style={{ borderBottom:'1px solid var(--border)', padding:'48px 48px 40px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48 }}>

          <div>
            <span className="font-display" style={{ fontSize:24, color:'var(--white)', letterSpacing:'0.08em', display:'block', marginBottom:14 }}>
              BOOTS <span style={{ color:'var(--green)' }}>VAULT</span>
            </span>
            <p style={{ fontSize:13, color:'rgba(242,242,237,0.3)', lineHeight:1.8, maxWidth:240 }}>
              The finest football boots. Authenticated, curated, and delivered across India.
            </p>
          </div>

          <div>
            <p style={{ fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:'var(--green)', marginBottom:18, fontWeight:700 }}>Shop</p>
            {[
              { label:'All Products', href:'/shop' },
              { label:'Boots', href:'/shop?category=boots' },
              { label:'Jerseys & Jackets', href:'/shop?category=jerseys-jackets' },
              { label:'Balls', href:'/shop?category=balls' },
              { label:'Gloves', href:'/shop?category=gloves' },
              { label:'Essentials', href:'/shop?category=essentials' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ display:'block', fontSize:13, color:'rgba(242,242,237,0.35)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color='var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color='rgba(242,242,237,0.35)')}>
                {label}
              </Link>
            ))}
          </div>

          <div>
            <p style={{ fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:'var(--green)', marginBottom:18, fontWeight:700 }}>Help</p>
            {[
              { label:'Size Guide', href:'/size-guide' },
              { label:'Shipping Policy', href:'/shipping' },
              { label:'Returns', href:'/returns' },
              { label:'Contact Us', href:'/contact' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ display:'block', fontSize:13, color:'rgba(242,242,237,0.35)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color='var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color='rgba(242,242,237,0.35)')}>
                {label}
              </Link>
            ))}
          </div>

          <div>
            <p style={{ fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:'var(--green)', marginBottom:18, fontWeight:700 }}>Account</p>
            {[
              { label:'Login', href:'/login' },
              { label:'My Orders', href:'/account' },
              { label:'Cart', href:'/cart' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ display:'block', fontSize:13, color:'rgba(242,242,237,0.35)', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color='var(--white)')}
                onMouseLeave={e => (e.currentTarget.style.color='rgba(242,242,237,0.35)')}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding:'20px 48px', maxWidth:1200, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <p style={{ fontSize:11, color:'rgba(242,242,237,0.18)' }}>© 2025 Boots Vault. All rights reserved.</p>
        <div style={{ display:'flex', gap:20 }}>
          {[
            { label:'Privacy Policy', href:'/privacy-policy' },
            { label:'Terms of Service', href:'/terms-of-service' },
          ].map(({ label, href }) => (
            <Link key={label} href={href} style={{ fontSize:11, color:'rgba(242,242,237,0.18)', textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color='rgba(242,242,237,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(242,242,237,0.18)')}>
              {label}
            </Link>
          ))}
        </div>
        <p style={{ fontSize:11, color:'rgba(242,242,237,0.18)' }}>Powered by Stripe · Secured by Firebase</p>
      </div>
    </footer>
  )
}
