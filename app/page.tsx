'use client'
import Footer from '@/components/Footer'
import Navbar from '@/components/navbar/Navbar'
import ConnectWalletButton from '@/components/ui/ConnectWalletButton'

export default function Home() {
  return (
    <main className="flex relative h-full w-full flex-col items-center">
      <Navbar />
      <section className="w-full md:w-[500px] flex flex-col items-center flex-1 justify-center">
        <h1 className="bg-title text-4xl md:text-7xl font-bold text-center text-black flex flex-col">
          <span className="max-w-max px-1.5">RUNESTOCK</span>
          <span className="max-w-max px-1.5 font-medium text-lg">
            Runes on Rootstock
          </span>
        </h1>
        <div className="my-8 w-[400px] text-justify">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos
          asperiores repellat repellendus dolorem vel, quam sunt autem maiores
          ut incidunt neque consequatur, officia eligendi. Nam, quas autem.
        </div>
        <div>
          <ConnectWalletButton />
        </div>
      </section>
      <Footer />
    </main>
  )
}
