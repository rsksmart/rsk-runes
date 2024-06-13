import { TabsTrigger, TabsList, Tabs, TabsContent } from '@/components/ui/tabs'
import EtchTab from '@/components/tabs/EtchTab'
import { useEffect, useState } from 'react'
import EtchingProgress from './EtchingProgress'
import { FormData } from '@/app/utils/types'
import {
  init,
  // @ts-ignore
} from 'bc-runes-js'

export default function TabsSection() {
  const [runePropsState, setRunePropsState] = useState<FormData>({
    name: '',
    symbol: '',
    premine: 0,
    amount: 0,
    cap: 0,
    divisibility: 0,
    address: '',
  } as FormData)
  const [revealTxHash, setRevealTxHash] = useState<string | null>(null)
  const [commitTxHash, setCommitTxHash] = useState<string | null>(
    'acccc58d16769f7b341291c361f0ac37adb6daafd71f17256cfa0d467417b6a6'
  )
  //INITIALIZE RUNES PACKAGE
  useEffect(() => {
    if (init) {
      const initVariables = {
        paymentAddress: process.env.NEXT_PUBLIC_PAYMENT_ADDRESS ?? '',
        ordinalsAddress: process.env.NEXT_PUBLIC_ORDINALS_ADDRESS ?? '',
        wif: process.env.NEXT_PUBLIC_WIF ?? '',
        feePerByte: 350,
      }
      init(initVariables)
      console.log('Initiated correctly')
    }
  }, [])

  useEffect(() => {
    const { revealTxHash, commitTxHash, runeProps } = JSON.parse(
      localStorage.getItem('runeData') || '{}'
    )
    if (runeProps) {
      setRunePropsState(runeProps)
      setRevealTxHash(revealTxHash ?? null)
      setCommitTxHash(commitTxHash ?? null)
    }
  }, [])

  return (
    <Tabs
      className="w-full max-w-2xl flex flex-col items-center"
      defaultValue="etch"
    >
      <TabsList className="grid grid-cols-2 w-fit mb-1">
        <TabsTrigger value="etch">Etch</TabsTrigger>
        <TabsTrigger disabled value="mint">
          Mint
        </TabsTrigger>
      </TabsList>
      <TabsContent value="etch" className='w-full'>
        {!commitTxHash ? (
          <EtchTab
            setRuneProps={setRunePropsState}
            setRevealTxHash={setRevealTxHash}
            setCommitTxHash={setCommitTxHash}
          />
        ) : (
          <EtchingProgress
            runeProps={runePropsState}
            revealTxHash={revealTxHash ?? null}
            commitTxHash={commitTxHash}
          />
        )}
      </TabsContent>
      {/* <div>
        <h1>Runes</h1>
        <button onClick={getTokenAddress}>Get Token Address</button>
        <button onClick={createRune}>Create Rune</button>
        {tokenAddress && <p>Token Address: {tokenAddress}</p>}
      </div> */}
    </Tabs>
  )
}
