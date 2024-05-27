import { TabsTrigger, TabsList, Tabs } from '@/components/ui/tabs'
import EtchTab from '@/components/tabs/EtchTab'
import MintTab from '@/components/tabs/MintTab'
import { ethers } from 'ethers'
import { useRuneERC20 } from '@/app/utils/hooks/useRuneERC20'

export default function TabsSection() {
  const { tokenAddress, getTokenAddress, createRune } = useRuneERC20({
    name: 'Rune', //TODO replace with correct value
    symbol: 'RUNE', //TODO replace with correct value
    initialSupply: ethers.parseUnits('1000', 18), //TODO replace with correct value
    initialOwner: '0x98F029c802dA9542c8BdE8FEc9587609371f6582', //TODO replace with correct address
    runeID: '1', //TODO replace with correct runeID
  })
  return (
    <Tabs className="w-full max-w-2xl" defaultValue="etch">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="etch">Etch</TabsTrigger>
        <TabsTrigger value="mint">Mint</TabsTrigger>
      </TabsList>
      <EtchTab />
      <MintTab />
      <div>
        <h1>Runes</h1>
        <button onClick={getTokenAddress}>Get Token Address</button>
        <button onClick={createRune}>Create Rune</button>
        {tokenAddress && <p>Token Address: {tokenAddress}</p>}
      </div>
    </Tabs>
  )
}
