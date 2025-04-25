import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Twitter Klonu',
  description: 'Next.js ile geliştirilmiş Twitter klonu',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}
