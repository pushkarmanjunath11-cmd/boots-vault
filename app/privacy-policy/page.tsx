'use client'

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:68, fontFamily:'Montserrat,sans-serif' }}>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'60px 40px' }}>
        <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--green)', marginBottom:12, fontWeight:700 }}>Legal</p>
        <h1 className="font-display" style={{ fontSize:'clamp(48px,6vw,80px)', color:'var(--white)', lineHeight:0.9, marginBottom:16 }}>PRIVACY<br />POLICY</h1>
        <p style={{ fontSize:13, color:'rgba(242,242,237,0.3)', marginBottom:48 }}>Last updated: January 2025</p>
        {[
          { title:'1. Information We Collect', content:`When you place an order or create an account on Boots Vault, we collect: your name, email address, phone number, delivery address, and payment information. Payment details are processed securely by Stripe and are never stored on our servers. We also collect basic usage data such as pages visited and products viewed to improve your shopping experience.` },
          { title:'2. How We Use Your Information', content:`We use your information to process and fulfil your orders, send order confirmations and shipping updates, respond to your queries and support requests, improve our website and product offerings, and send you promotional communications if you have opted in. We do not sell, trade, or rent your personal information to third parties.` },
          { title:'3. Data Storage & Security', content:`Your data is stored securely using Google Firebase, which is protected by industry-standard security measures. All data is encrypted in transit using SSL/TLS. We retain your order data for up to 3 years for accounting and legal compliance purposes. You may request deletion of your account and personal data at any time by contacting us.` },
          { title:'4. Cookies', content:`Boots Vault uses essential cookies to keep your shopping cart active and maintain your login session. We do not use tracking cookies or third-party advertising cookies. You can disable cookies in your browser settings, but this may affect the functionality of the website.` },
          { title:'5. Third-Party Services', content:`We use the following third-party services: Stripe for payment processing, Google Firebase for database and authentication, and Vercel for website hosting. Each of these services has their own privacy policy and handles your data in accordance with their respective terms.` },
          { title:'6. Your Rights', content:`You have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, opt out of marketing communications at any time, and lodge a complaint with a data protection authority. To exercise any of these rights, please contact us.` },
          { title:"7. Children's Privacy", content:`Boots Vault is not intended for use by children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.` },
          { title:'8. Changes to This Policy', content:`We may update this privacy policy from time to time. When we do, we will update the date at the top of this page. We encourage you to review this policy periodically.` },
          { title:'9. Contact Us', content:`If you have any questions about this privacy policy, please contact us at hello@bootsvault.in or through our Contact page.` },
        ].map(({ title, content }, i) => (
          <div key={title} style={{ marginBottom:2 }}>
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border)', padding:'28px 32px', borderTop: i===0 ? '3px solid var(--green)' : '1px solid var(--border)' }}>
              <h2 style={{ fontSize:15, fontWeight:800, color:'var(--white)', marginBottom:12 }}>{title}</h2>
              <p style={{ fontSize:13, color:'rgba(242,242,237,0.45)', lineHeight:1.9 }}>{content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
