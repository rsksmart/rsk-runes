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

export default function MintTab(): JSX.Element {
  return (
    <TabsContent value="mint">
      <Card>
        <CardHeader>
          <CardTitle>Mint</CardTitle>
          <CardDescription>Mint a rune.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                className="w-[300px]"
                id="name"
                placeholder="Enter token name"
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
        </CardContent>
        <CardFooter>
          <Button>Create Mint Token</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}
