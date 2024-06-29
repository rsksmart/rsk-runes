'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import TabsSection from '@/components/tabs'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/Footer'

const Home = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, router])

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <Navbar />
      <section className="w-full flex flex-col items-center flex-1">
        <h1 className="bg-title text-4xl md:text-5xl font-bold mb-10 text-center text-black flex flex-col">
          <span className="max-w-max px-1.5">Runes</span>
        </h1>
        {children}
      </section>
      <Footer />
    </div>
  )
}

export default Home
