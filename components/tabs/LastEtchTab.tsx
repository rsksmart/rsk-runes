import { TabsTrigger, TabsList, TabsContent, Tabs } from '@/components/ui/tabs'
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export default function LastEtchTab(): JSX.Element {
  return (
    <TabsContent value="lastEtch">
      <Card>
        <CardHeader>
          <CardTitle>Last Etch</CardTitle>
          <CardDescription>
            Information about the Last Etch token.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <p className="text-lg font-medium">Last Etch</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <p className="text-lg font-medium">⚛</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Progress</Label>
            <Progress className="w-full" value={70} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The Last Etch token is a limited edition. The progress is
              currently at 70%.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Learn More</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}
