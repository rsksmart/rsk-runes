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

export default function MintTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint</CardTitle>
        <CardDescription>Mint a rune.</CardDescription>
      </CardHeader>
      <CardContent>
        <section className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter rune name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
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
      <CardFooter className="flex justify-end p-6 relative z-0">
        <Button className="bg-white text-black">Create Mint Token</Button>
      </CardFooter>
    </Card>
  )
}
