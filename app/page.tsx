'use client'

import Footer from '@/components/Footer'
import Navbar from '@/components/navbar/Navbar'
import TabsSection from '@/components/tabs'
import { mint } from '@/functions'

export default function Home() {
  const onMint = async () => {
    await mint()
  }

  return (
    <main className="flex relative h-full w-full flex-col items-center">
      <Navbar />
      <section className="mb-10 z-10 flex flex-1 w-full px-6 flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-10 text-center text-black">
          <span className='bg-title max-w-max px-1.5'>Runes</span>
        </h1>
        <TabsSection />
      </section>
      <Footer />
    </main>
  )
}
