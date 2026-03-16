'use client'
import Link from 'next/link'

export default function SizeGuidePage() {
  const sizes = [
    { uk:'6', us:'6.5', eu:'39', cm:'24' },
    { uk:'6.5', us:'7', eu:'39.5', cm:'24.5' },
    { uk:'7', us:'7.5', eu:'40.5', cm:'25' },
    { uk:'7.5', us:'8', eu:'41', cm:'25.5' },
    { uk:'8', us:'8.5', eu:'42', cm:'26' },
    { uk:'8.5', us:'9', eu:'42.5', cm:'26.5' },
    { uk:'9', us:'9.5', eu:'43', cm:'27' },
    { uk:'9.5', us:'10', eu:'44', cm:'27.5' },
    { uk:'10', us:'10.5', eu:'44.5', cm:'28' },
    { uk:'10.5', us:'11', eu:'45', cm:'28.5' },
    { uk:'11', us:'11.5', eu:'46', cm:'29' },
  ]
  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:68, fontFamily:'Montserrat,sans-serif' }}>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'clamp(32px,5vw,60px) clamp(20px,4vw,40px)' }}>
        <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--green)', marginBottom:12, fontWeight:700 }}>Reference</p>
        <h1 className="font-display" style={{ fontSize:'clamp(48px,8vw,80px)', color:'var(--white)', lineHeight:0.9, marginBottom:16 }}>SIZE<br />GUIDE</h1>
        <p style={{ fontSize:14, color:'rgba(242,242,237,0.4)', marginBottom:40, lineHeight:1.8 }}>
          All boots are listed in UK sizing. When in doubt, go half a size up — football boots tend to run narrow.
        </p>

        <div style={{ border:'1px solid var(--border)', overflow:'hidden', marginBottom:40 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:'var(--bg3)', borderBottom:'1px solid var(--border)' }}>
            {['UK','US','EU','CM'].map(h => (
              <div key={h} style={{ padding:'12px 16px', fontSize:10, fontWeight:800, letterSpacing:'0.3em', color:'var(--green)' }}>{h}</div>
            ))}
          </div>
          {sizes.map((row, i) => (
            <div key={row.uk} style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderBottom: i < sizes.length-1 ? '1px solid var(--border)' : 'none', background: i%2===0 ? 'transparent' : 'rgba(242,242,237,0.015)' }}>
              {[row.uk, row.us, row.eu, row.cm].map((val, j) => (
                <div key={j} style={{ padding:'12px 16px', fontSize:14, fontWeight: j===0 ? 700 : 400, color: j===0 ? 'var(--white)' : 'rgba(242,242,237,0.5)' }}>{val}</div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))', gap:12 }}>
          {[
            { title:'Measure in the evening', desc:'Feet swell throughout the day — measure at the end of the day for the most accurate size.' },
            { title:'Wear your match socks', desc:'Always try boots with the socks you\'ll wear on the pitch for the best fit.' },
            { title:'FG/AG boots fit snug', desc:'Firm ground boots are designed to fit close to the foot for maximum control.' },
            { title:'Still unsure?', desc:'Contact us on WhatsApp and we\'ll help you pick the right size.' },
          ].map(({ title, desc }) => (
            <div key={title} style={{ background:'var(--bg3)', border:'1px solid var(--border)', padding:20 }}>
              <p style={{ fontSize:13, fontWeight:700, color:'var(--white)', marginBottom:8 }}>{title}</p>
              <p style={{ fontSize:12, color:'rgba(242,242,237,0.4)', lineHeight:1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}