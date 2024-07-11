import type { Metadata } from 'next'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'

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
      <body className="h-screen">
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  )
}
