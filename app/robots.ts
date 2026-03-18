export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://boots-vault.vercel.app/sitemap.xml",
  }
}