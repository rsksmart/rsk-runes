import { TabsTrigger, TabsList, Tabs } from '@/components/ui/tabs'
import EtchTab from '@/components/tabs/EtchTab'
import MintTab from '@/components/tabs/MintTab'

export default function TabsSection() {
  return (
    <Tabs className="w-full max-w-2xl" defaultValue="etch">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="etch">Etch</TabsTrigger>
        <TabsTrigger value="mint">Mint</TabsTrigger>
      </TabsList>
      <EtchTab />
      <MintTab />
    </Tabs>
  )
}
