import '@/styles/globals.css'
import Head from 'next/head'
import { ThemeProvider } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet" />
        <title>TheNationBrief — Defence & Geopolitics Intelligence</title>
        <meta name="description" content="India's premier defence and geopolitics intelligence portal" />
        <meta name="google-site-verification" content="ZG2-NIGRjFd01ZyNGhnx3yyQfJoJUbKq-TplMSdxV80" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </ThemeProvider>
  )
}