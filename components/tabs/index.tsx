import { TabsTrigger, TabsList, Tabs, TabsContent } from '@/components/ui/tabs'
import EtchTab from '@/components/tabs/EtchTab'
import { useEffect, useState } from 'react'
import EtchingProgress from './EtchingProgress'
import { FormData } from '@/app/utils/types'
import EtchRunesToRBTC from './EtchRunesToRBTC'
import RunesList from './RunesList'

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
      {/* <TabsList className="grid grid-cols-3 w-fit mb-1">
        <TabsTrigger value="etch">Etch</TabsTrigger>
        <TabsTrigger disabled value="mint">
          Mint
        </TabsTrigger>
        <TabsTrigger disabled value="Runes to RBTC">
          Runes to RBTC
        </TabsTrigger>
      </TabsList> */}
      <TabsContent value="etch" className="w-full">
        {!commitTxHash ? (
          <EtchTab
            setRuneProps={setRunePropsState}
            setCommitTxHash={setCommitTxHash}
          />
        ) : (
          <EtchRunesToRBTC />
          // <EtchingProgress
          //   runeProps={runePropsState}
          //   commitTxHash={commitTxHash}
          //   setRevealTxHash={setRevealTxHash}
          //   setCommitTxHash={setCommitTxHash}
          //   revealTxHash={revealTxHash}
          //   etchedFinished={etchedFinished}
          //   setEtchedFinished={setEtchedFinished}
          // />
        )}
      </TabsContent>
      <RunesList />
      {/* <div>
        <h1>Runes</h1>
        <button onClick={getTokenAddress}>Get Token Address</button>
        <button onClick={createRune}>Create Rune</button>
        {tokenAddress && <p>Token Address: {tokenAddress}</p>}
      </div> */}
    </Tabs>
  )
}
