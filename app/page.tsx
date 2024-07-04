'use client'
import Footer from '@/components/Footer'
import BtcIcon from '@/components/icons/BtcIcon'
import Navbar from '@/components/navbar/Navbar'
import ConnectWalletButton from '@/components/ui/ConnectWalletButton'

export default function Home() {
  return (
    <main className="flex relative h-full w-full flex-col items-center">
      <Navbar />
      <section className="w-full h-full md:w-[1000px] xl:w-[1300px] m-auto mt-4">
        <div className="w-full relative">
          <h1 className="md:text-6xl xl:text-[78px] relative z-10 font-bold text-center text-black flex gap-2.5 items-center">
            <span className="max-w-max px-1.5 bg-white">Runestock</span>
            <span className="bg-custom-green px-1.5">Runes</span>
            <span className="bg-title px-1.5">on Rootstock</span>
          </h1>
          <BtcIcon className="absolute right-0 top-0 md:w-[170px] xl:w-[200px] z-0" />
        </div>
        <div className="mt-10">
          <span className="bg-custom-cyan text-lg flex w-8 h-8 justify-center items-center font-semibold rounded-full text-black">
            1.
          </span>
          <h1 className="text-4xl text-white font-semibold mt-4 mb-2">
            Go to the app
          </h1>
          <div className="flex items-center gap-4">
            <ConnectWalletButton />
          </div>
        </div>
        <div className="mt-10 flex gap-3">
          <div className="flex-1 mt-4 border border-white rounded-3xl p-4">
            <div className="flex gap-2">
              <h3 className="bg-custom-lime w-max text-black text-3xl font-semibold px-2 py-1">
                RUNES
              </h3>
              <span className="bg-custom-lime text-sm h-7 rounded-3xl w-7 flex justify-center items-center text-black font-semibold">
                0.1
              </span>
            </div>
            <div className="mt-3 text-justify">
              This project implements a <i>toy bridge</i> for etching{' '}
              <a
                href="https://docs.ordinals.com/runes/specification.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                runes
              </a>{' '}
              on Bitcoin and transferring them to Rootstock, and vice versa,
              transferring runes on Rootstock to a Bitcoin address.
            </div>
          </div>
          <div className="flex-1 mt-4 border border-white rounded-3xl p-4">
            <div className="flex gap-2">
              <h3 className="bg-custom-pink w-max text-black text-3xl font-semibold px-2 py-1">
                TOY
              </h3>
              <span className="bg-custom-pink text-sm h-7 rounded-3xl w-7 flex justify-center items-center text-black font-semibold">
                0.2
              </span>
            </div>
            <div className="mt-3 text-justify">
              The term "toy" denotes that this is not an actual bridge, as each
              locked rune will be held by a unique, centralized Bitcoin address
              defined in the configuration. Users will only have ownership over
              their Rootstock representation until they claim them back.
            </div>
          </div>
          <div className="flex-1 mt-4 border border-white rounded-3xl p-4">
            <div className="flex gap-2">
              <h3 className="bg-title pink w-max text-black text-3xl font-semibold px-2 py-1">
                PROJECT
              </h3>
              <span className="bg-title text-sm h-7 rounded-3xl w-7 flex justify-center items-center text-black font-semibold">
                0.3
              </span>
            </div>
            <div className="mt-3 text-justify">
              The{' '}
              <a
                href="https://github.com/rsksmart/rsk-runes"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                project
              </a>{' '}
              is open source, and contributions are welcome. Feel free to reach
              out to Rootstock through its different channels for any inquiries
              or support.
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
