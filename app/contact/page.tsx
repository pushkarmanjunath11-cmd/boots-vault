'use client'

import { useState } from 'react'
import { MessageCircle, Mail, Clock, MapPin, Send, Check } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)
  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const submit = () => { if (!form.name || !form.email || !form.message) return; setSent(true) }

  const inp: React.CSSProperties = { width:'100%', background:'var(--bg3)', border:'1px solid var(--border)', padding:'13px 16px', fontSize:14, color:'var(--white)', outline:'none', boxSizing:'border-box', fontFamily:'Montserrat,sans-serif', transition:'border-color 0.2s' }
  const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(242,242,237,0.3)', marginBottom:8, fontWeight:700 }

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:68, fontFamily:'Montserrat,sans-serif' }}>
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'clamp(32px,5vw,60px) clamp(20px,4vw,40px)' }}>
        <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--green)', marginBottom:12, fontWeight:700 }}>Get in Touch</p>
        <h1 className="font-display" style={{ fontSize:'clamp(48px,8vw,80px)', color:'var(--white)', lineHeight:0.9, marginBottom:40 }}>CONTACT<br />US</h1>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap:24 }}>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { icon:MessageCircle, color:'#22c55e', title:'WhatsApp', sub:'Fastest response', value:'+91 7996097779', link:'https://wa.me/917996097779' },
              { icon:Mail, color:'#60a5fa', title:'Email', sub:'Reply within 24hrs', value:'bootsvault.in@gmail.com', link:'mailto:bootsvault.in@gmail.com' },
              { icon:Clock, color:'#d4af37', title:'Business Hours', sub:'When we\'re available', value:'Mon–Sat · 10am–8pm IST', link:null },
              { icon:MapPin, color:'#c084fc', title:'Location', sub:'Based in', value:'Pune, Maharashtra, India', link:null },
            ].map(({ icon:Icon, color, title, sub, value, link }) => (
              <div key={title} style={{ background:'var(--bg3)', border:'1px solid var(--border)', padding:'clamp(16px,2vw,20px) clamp(16px,2vw,24px)', display:'flex', gap:14, alignItems:'flex-start' }}>
                <div style={{ width:40, height:40, background:`${color}15`, border:`1px solid ${color}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={16} color={color} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:'var(--white)', marginBottom:2 }}>{title}</p>
                  <p style={{ fontSize:10, color:'rgba(242,242,237,0.25)', marginBottom:4 }}>{sub}</p>
                  <p style={{ fontSize:13, color:'rgba(242,242,237,0.55)' }}>{value}</p>
                  {link && (
                    <button onClick={() => window.open(link, '_blank')} style={{ marginTop:8, fontSize:10, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color, background:'none', border:`1px solid ${color}33`, padding:'4px 12px', cursor:'pointer', fontFamily:'Montserrat' }}>
                      Contact →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', padding:'clamp(20px,3vw,32px)', position:'relative' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg, var(--green), transparent)' }} />
            {sent ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div style={{ width:52, height:52, background:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 0 24px rgba(34,197,94,0.4)' }}>
                  <Check size={22} color="#050505" strokeWidth={3} />
                </div>
                <h3 className="font-display" style={{ fontSize:28, color:'var(--white)', marginBottom:8 }}>SENT!</h3>
                <p style={{ fontSize:13, color:'rgba(242,242,237,0.4)' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize:16, fontWeight:800, color:'var(--white)', marginBottom:20 }}>Send a Message</h2>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div><label style={lbl}>Name *</label><input name="name" value={form.name} onChange={handle} placeholder="Your Name Here" style={inp} onFocus={e => (e.target.style.borderColor='rgba(34,197,94,0.4)')} onBlur={e => (e.target.style.borderColor='var(--border)')} /></div>
                    <div><label style={lbl}>Email *</label><input name="email" type="email" value={form.email} onChange={handle} placeholder="youremail@gmail.com" style={inp} onFocus={e => (e.target.style.borderColor='rgba(34,197,94,0.4)')} onBlur={e => (e.target.style.borderColor='var(--border)')} /></div>
                  </div>
                  <div><label style={lbl}>Subject</label><input name="subject" value={form.subject} onChange={handle} placeholder="What's this about?" style={inp} onFocus={e => (e.target.style.borderColor='rgba(34,197,94,0.4)')} onBlur={e => (e.target.style.borderColor='var(--border)')} /></div>
                  <div>
                    <label style={lbl}>Message *</label>
                    <textarea name="message" value={form.message} onChange={handle} rows={5} placeholder="Tell us how we can help..." style={{ ...inp, resize:'none' }} onFocus={e => (e.target.style.borderColor='rgba(34,197,94,0.4)')} onBlur={e => (e.target.style.borderColor='var(--border)')} />
                  </div>
                  <button onClick={submit} disabled={!form.name || !form.email || !form.message}
                    style={{ width:'100%', padding:'14px', background:'var(--green)', color:'#050505', border:'none', fontSize:12, fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:'Montserrat', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity: !form.name || !form.email || !form.message ? 0.4 : 1 }}>
                    <Send size={13} /> Send Message
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}