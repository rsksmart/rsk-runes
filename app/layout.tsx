import type { Metadata } from 'next'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import Footer from '@/components/Footer'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata: Metadata = {
  title: 'Runes',
  description: 'Runes | Rootstock',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className='h-screen'>
        <TooltipProvider>{children}</TooltipProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
