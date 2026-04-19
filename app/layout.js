import './globals.css'

export const metadata = {
  title: 'Dashboard Meteorológico — INMET',
  description: 'Dashboard meteorológico com dados reais do INMET',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
