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
import { formatAddress } from '@/lib/utils'
import { FormData } from '@/app/utils/types'
// @ts-ignore
import { getConfirmations, isConfirmed } from 'bc-runes-js'
import { toast } from 'react-toastify'

type Props = {
  runeProps: FormData
  revealTxHash: string | null
  commitTxHash: string | null
}

export default function EtchingProgress({
  runeProps,
  revealTxHash,
  commitTxHash,
}: Props): JSX.Element {
  const [confirmations, setConfirmations] = useState(0)
  const [progress, setProgress] = useState(0)
  const { name, symbol, address: owner } = runeProps

  useEffect(() => {
    checkStatus()
  }, [revealTxHash])

  useEffect(() => {
    if (progress >= 100) {
      continueEtching()
    }
  }, [progress])

  useEffect(() => {
    setProgress(Math.round((confirmations / 7) * 100))
  }, [confirmations])

  async function checkStatus() {
    console.log('checking status')
    console.log('revealTxHash:', revealTxHash)
    if (revealTxHash) {
      console.log('revealTxHash is for getting confirmations:', revealTxHash)
      const confirmations = await isConfirmed(revealTxHash)
      toast.success('Rune has been Etched!')
    } else {
      console.log('commitTxHash is for getting confirmations:', commitTxHash)
      const confirmations = await getConfirmations(commitTxHash)
      setConfirmations(confirmations)
      console.log('confirmations are:', confirmations)
    }
  }

  async function continueEtching() {
    console.log('ON continue etching')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Information about the rune: {name}.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">From</Label>
            <p className="text-lg font-medium">{formatAddress(owner!)}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <p className="text-lg font-medium">{symbol}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Progress</Label>
          <Progress className="w-full" value={progress} />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The Last Etch token is a limited edition. The progress is currently
            at {progress}%.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={checkStatus}>Refresh</Button>
      </CardFooter>
    </Card>
  )
}
