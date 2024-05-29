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
        <CardHeader className="opacity-30">
          <CardTitle>Mint</CardTitle>
          <CardDescription>Mint a rune.</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="absolute inset-0 grid place-items-center z-10">
            <p className="text-center p-5 bg-white/80 rounded text-black w-fit">
              Not Available yet.
            </p>
          </div>
          <section className="opacity-30 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  className="w-[300px]"
                  id="name"
                  placeholder="Enter rune name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  className="w-[300px]"
                  id="amount"
                  placeholder="Enter mint repeats"
                  type="number"
                />
              </div>
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="address">Rootstock Address</Label>
              <Input id="address" placeholder="Enter your RSK address" />
            </div>
          </section>
        </CardContent>
        <CardFooter className="opacity-30">
          <Button disabled>Create Mint Token</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}
