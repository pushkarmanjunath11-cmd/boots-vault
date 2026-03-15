'use client'

export default function TermsOfServicePage() {
  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh', paddingTop:68, fontFamily:'Montserrat,sans-serif' }}>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'60px 40px' }}>
        <p style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--green)', marginBottom:12, fontWeight:700 }}>Legal</p>
        <h1 className="font-display" style={{ fontSize:'clamp(48px,6vw,80px)', color:'var(--white)', lineHeight:0.9, marginBottom:16 }}>TERMS OF<br />SERVICE</h1>
        <p style={{ fontSize:13, color:'rgba(242,242,237,0.3)', marginBottom:48 }}>Last updated: January 2025</p>
        {[
          { title:'1. Acceptance of Terms', content:`By accessing and using the Boots Vault website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website. These terms apply to all visitors, users, and customers of Boots Vault.` },
          { title:'2. Products & Authenticity', content:`All products sold on Boots Vault are 100% authentic and sourced from authorised distributors. We do not sell counterfeit, replica, or unauthorised products. Product images are for illustration purposes and may slightly differ from the actual product. We reserve the right to limit quantities, discontinue products, or modify prices at any time without prior notice.` },
          { title:'3. Pricing & Payment', content:`All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. Prices may change at any time without prior notice. Payment is processed securely via Stripe. We accept all major credit and debit cards. Orders are confirmed only after successful payment. In the event of a pricing error, we reserve the right to cancel the order and issue a full refund.` },
          { title:'4. Orders & Cancellations', content:`Once an order is placed and payment is confirmed, it enters our processing queue. You may request a cancellation within 2 hours of placing the order by contacting us immediately on WhatsApp. Orders that have already been dispatched cannot be cancelled. We reserve the right to cancel any order at our discretion and will issue a full refund in such cases.` },
          { title:'5. Shipping & Delivery', content:`We offer free shipping across India on all orders. Delivery typically takes 4-7 business days. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by courier services, weather, or circumstances beyond our control. Once dispatched, a tracking link will be shared with you via email and WhatsApp.` },
          { title:'6. Returns & Refunds', content:`We accept returns within 7 days of delivery for unworn, unwashed products in original condition with all tags attached. To initiate a return, contact us via WhatsApp with your order ID. Refunds are processed within 5-7 business days after we receive and inspect the returned item. Shipping costs for returns are borne by the customer unless the return is due to a defect or incorrect item sent by us.` },
          { title:'7. Account Responsibility', content:`You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account. We are not liable for any loss or damage arising from your failure to protect your account information.` },
          { title:'8. Intellectual Property', content:`All content on the Boots Vault website, including text, graphics, logos, images, and software, is the property of Boots Vault or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.` },
          { title:'9. Limitation of Liability', content:`Boots Vault shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use our website or products. Our total liability to you for any claim arising from these terms shall not exceed the amount you paid for the product in question.` },
          { title:'10. Governing Law', content:`These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.` },
          { title:'11. Contact Us', content:`If you have any questions about these Terms of Service, please contact us at hello@bootsvault.in or through our Contact page.` },
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
