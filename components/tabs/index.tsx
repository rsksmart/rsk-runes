'use client'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import EtchTab from '@/components/tabs/EtchTab'
import { useEffect, useState } from 'react'
import EtchingProgress from '@/components/tabs/EtchingProgress'
import { UseRuneERC1155Props } from '@/app/utils/hooks/useRuneERC1155'
import RunesList from './RunesList'

export default function TabsSection() {
  const [runePropsState, setRunePropsState] = useState<UseRuneERC1155Props>({
    name: '',
    symbol: '',
    premine: 0,
    amount: 0,
    cap: 0,
    divisibility: 0,
    receiver: '',
  } as UseRuneERC1155Props)
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
      <TabsContent value="etch" className="w-full">
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
            setCommitTxHash={setCommitTxHash}
            revealTxHash={revealTxHash}
            etchedFinished={etchedFinished}
            setEtchedFinished={setEtchedFinished}
          />
        )}
        {!commitTxHash && <RunesList />}
      </TabsContent>
    </Tabs>
  )
}
