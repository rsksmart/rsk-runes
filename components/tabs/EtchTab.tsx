import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'

export default function EtchTab(): JSX.Element {
  return (
    <TabsContent value="etch">
      <Card>
        <CardHeader>
          <CardTitle>Etch</CardTitle>
          <CardDescription>Etch a new rune.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                className="w-[300px]"
                id="name"
                placeholder="Enter token name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                className="w-[300px]"
                id="symbol"
                placeholder="Enter token symbol"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="premine">Premine</Label>
              <Input
                className="w-[300px]"
                id="premine"
                placeholder="Enter premine amount"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                className="w-[300px]"
                id="amount"
                placeholder="Enter token amount"
                type="number"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cap">Cap</Label>
              <Input id="cap" placeholder="Enter token cap" type="number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="divisibility">Divisibility</Label>
              <Input
                id="divisibility"
                placeholder="Enter token divisibility"
                type="number"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Create Etch Token</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}
