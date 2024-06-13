import { TabsTrigger, TabsList, Tabs, TabsContent } from '@/components/ui/tabs'
import EtchTab from '@/components/tabs/EtchTab'
import { useEffect, useState } from 'react'
import EtchingProgress from './EtchingProgress'
import { FormData } from '@/app/utils/types'

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
  const [commitTxHash, setCommitTxHash] = useState<string | null>(null)
  const [revealTxHash, setRevealTxHash] = useState<string | null>(null)
  const [etchedFinished, setEtchedFinished] = useState(false)

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

  useEffect(() => {
    console.log('new revealtxhash is ', revealTxHash)
  }, [revealTxHash])

  return (
    <Tabs
      className="w-full max-w-2xl flex flex-col items-center"
      defaultValue="etch"
    >
      <TabsList className="grid grid-cols-2 w-fit">
        <TabsTrigger value="etch">Etch</TabsTrigger>
        <TabsTrigger disabled value="mint">
          Mint
        </TabsTrigger>
      </TabsList>
      <TabsContent value="etch">
        {!commitTxHash ? (
          <EtchTab
            setRuneProps={setRunePropsState}
            setCommitTxHash={setCommitTxHash}
          />
        ) : (
          <EtchingProgress
            runeProps={runePropsState}
            commitTxHash={commitTxHash}
            setRevealTxHash={setRevealTxHash}
            revealTxHash={revealTxHash}
            etchedFinished={etchedFinished}
            setEtchedFinished={setEtchedFinished}
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
