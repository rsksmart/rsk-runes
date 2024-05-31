import { TabsTrigger, TabsList, Tabs } from '@/components/ui/tabs'
import EtchTab, { FormData } from '@/components/tabs/EtchTab'
import { useState } from 'react'
import LastEtchTab from './LastEtchTab'

export default function TabsSection() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [runeProps, setRuneProps] = useState({
    name: '',
    symbol: '',
    premine: 0,
    amount: 0,
    cap: 0,
    divisibility: 0,
    address: ''
  } as FormData)

  return (
    <Tabs className="w-full max-w-2xl" defaultValue="etch">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="etch">Etch</TabsTrigger>
        <TabsTrigger value="lastEtch">Last Etch</TabsTrigger>
      </TabsList>
      <EtchTab setRuneProps={setRuneProps}/>
      <LastEtchTab
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        runeProps={runeProps}
      />
      <div>
        {/* <h1>Runes</h1>
        <button onClick={getTokenAddress}>Get Token Address</button>
        <button onClick={createRune}>Create Rune</button>
        {tokenAddress && <p>Token Address: {tokenAddress}</p>} */}
      </div>
    </Tabs>
  )
}
