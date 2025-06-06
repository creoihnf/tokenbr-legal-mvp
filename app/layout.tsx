import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'TokenBR Legal - Antecipe Recebíveis com Taxas 70% Menores',
  description: 'Marketplace P2P que conecta empresas e investidores para antecipação de recebíveis com taxas muito menores que bancos tradicionais.',
  keywords: 'antecipação recebíveis, capital de giro, investimento, PME, fintech',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://tokenbr.xyz',
    title: 'TokenBR Legal - Antecipe Recebíveis',
    description: 'Taxas 50-70% menores que bancos tradicionais',
    siteName: 'TokenBR Legal',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="antialiased bg-gray-50">
        {process.env.GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
              `}
            </Script>
          </>
        )}
        
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}