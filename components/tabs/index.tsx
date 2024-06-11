import { TabsTrigger, TabsList, Tabs, TabsContent } from '@/components/ui/tabs'
import EtchTab from '@/components/tabs/EtchTab'
import { useEffect, useState } from 'react'
import EtchingProgress from './EtchingProgress'
import { FormData } from '@/app/utils/types'

export default function TabsSection() {
  const [runeProps, setRuneProps] = useState<FormData>({
    name: '',
    symbol: '',
    premine: 0,
    amount: 0,
    cap: 0,
    divisibility: 0,
    address: '',
  } as FormData)
  const [revealTxHash, setRevealTxHash] = useState('')
  const [commitTxHash, setCommitTxHash] = useState('')

  useEffect(() => {
    const { revealTxHash, commitTxHash, runeProps } = JSON.parse(
      localStorage.getItem('runeData') || '{}'
    )

    if (runeProps) {
      setRuneProps(runeProps)
      setRevealTxHash(revealTxHash || '')
      setCommitTxHash(commitTxHash || '')
    }
  }, [])

  return (
    <Tabs
      className="w-full max-w-2xl flex flex-col items-center"
      defaultValue="etch"
    >
      <TabsList className="grid grid-cols-2 w-fit">
        <TabsTrigger value="etch">Etch</TabsTrigger>
        <TabsTrigger disabled value="mint">
          mint
        </TabsTrigger>
      </TabsList>
      <TabsContent value="etch">
        {!commitTxHash ? (
          <EtchTab
            setRuneProps={setRuneProps}
            setRevealTxHash={setRevealTxHash}
            setCommitTxHash={setCommitTxHash}
          />
        ) : (
          <EtchingProgress
            runeProps={runeProps}
            revealTxHash={revealTxHash}
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
