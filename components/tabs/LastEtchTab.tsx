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
import { useEffect, useState, useMemo } from 'react'
import { useRuneERC20 } from '@/app/utils/hooks/useRuneERC20'
import { FormData } from './EtchTab'
import { ethers } from 'ethers'

type Props = {
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void
  runeProps: FormData
}

async function getConfirmations(hash: string) {
  return 2 * 2
}

async function isConfirmed(hash: string) {
  return 2 === 2
}

export default function LastEtchTab({
  isProcessing,
  setIsProcessing,
  runeProps
}: Props): JSX.Element {
  const [confirmations, setConfirmations] = useState(0)
  const { name, symbol, premine, amount, cap, address, divisibility } = runeProps

  const progress = useMemo(() => {
    return confirmations ? Math.round(confirmations / 7 * 100) : 0
  }, [confirmations])

  const maxSupply = Math.round((+premine! + +amount! * +cap!) / Math.pow(10, +divisibility!))

  const {
    tokenAddress,
    getTokenAddress,
    createRune,
    loadingCreateRune,
    txStatus, // possible states are: 'pending', 'success', 'error'
    createReceipt, // TX receipt for the createRune transaction
  } = useRuneERC20({
    name,
    symbol,
    initialSupply: ethers.parseUnits(String(premine), divisibility),
    initialOwner: address,
    runeID: '1001',
    _mintAmount: ethers.parseUnits(amount ? String(amount) : String(0), divisibility!),
    _maxSupply: ethers.parseUnits(isNaN(maxSupply) ? String(0) : String(maxSupply), divisibility!)
  })

  useEffect(() => {
    if (localStorage.getItem('revealData') || localStorage.getItem('commitData')) {
      setIsProcessing(true)
      checkStatus()
    }
  }, [])

  async function checkStatus () {
    const { revealTxHash } = JSON.parse(localStorage.getItem('reavealData') || '{}')

    if (revealTxHash) {
      const confirmed = await isConfirmed(revealTxHash)
      if (confirmed) setConfirmations(confirmations => confirmations + 1)
    } else {
      const { commitTxHash } = JSON.parse(localStorage.getItem('commitData') || '{}')
      const confirmations = await getConfirmations(commitTxHash)
      setConfirmations(confirmations)
    }
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
        {isProcessing ? (
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
          <Button onClick={checkStatus}>Refresh</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}
