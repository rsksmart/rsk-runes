'use client'

import Footer from '@/components/Footer'
import TabsSection from '@/components/tabs'
import { mint } from '@/functions'

export default function Home() {
  const onMint = async () => {
    await mint()
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-between">
      <div className="gradient scale-[.2] md:scale-100 absolute right-0 opacity-70 animate-pulse"></div>
      <div className="gradient scale-[.2] md:scale-100 absolute left-0 bottom-0 opacity-70 animate-pulse"></div>
      <section className="mb-20 z-10">
        <h1 className="text-3xl md:text-5xl font-bold mt-20 mb-10 text-center">
          Runes
        </h1>
        <TabsSection />
      </section>
      <Footer />
    </main>
  )
}
