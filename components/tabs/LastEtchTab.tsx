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
import { useEffect, useState } from 'react'

type Props = {
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void
}

export default function LastEtchTab({
  isProcessing,
  setIsProcessing,
}: Props): JSX.Element {
  const [commitConfirmations, setCommitConfirmations] = useState<number | null>(
    null
  )
  const [revealConfirm, setRevealConfirm] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  useEffect(() => {
    if (localStorage.getItem('commitData')) {
      setIsProcessing(true)
      reCheckState()
    }
  }, [localStorage.getItem('commitData')])

  const reCheckState = async () => {
    const commitData = JSON.parse(localStorage.getItem('commitData') || '{}')
    const { commitTxHash, scriptP2trAddress, tapLeafScript } = commitData
    const confirmations = await getConfirmations(commitTxHash) //returns number of confirmations for the commit transaction
    setProgress(confirmations > 0 ? (confirmations / 6) * 100 : 0)
  }
  const getConfirmations = async (commitTxHash: string) => {
    return 1
  }
  return (
    <TabsContent value="lastEtch">
      <Card>
        <CardHeader>
          <CardTitle>Last Etch</CardTitle>
          <CardDescription>
            Information about the Last Etch token.
          </CardDescription>
        </CardHeader>
        {!isProcessing ? (
          <div>No data </div>
        ) : (
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
              <Progress className="w-full" value={progress} />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The Last Etch token is a limited edition. The progress is
                currently at 70%.
              </p>
            </div>
          </CardContent>
        )}
        <CardFooter>
          <Button>Refresh</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}
