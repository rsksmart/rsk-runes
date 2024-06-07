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
import { getConfirmations, isConfirmed } from 'bc-runes-js'
import { formatAddress } from '@/lib/utils'

type Props = {
  runeProps: FormData
  revealTxHash: string
  commitTxHash: string
}

export default function EtchingProgress({
  runeProps,
  revealTxHash,
  commitTxHash,
}: Props): JSX.Element {
  const [confirmations, setConfirmations] = useState(0)
  const { name, symbol, address: owner } = runeProps

  const progress = useMemo(() => {
    return confirmations ? Math.round((confirmations / 7) * 100) : 0
  }, [confirmations])

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    if (revealTxHash) {
      const confirmed = await isConfirmed(revealTxHash)
      if (confirmed) setConfirmations((confirmations) => confirmations + 1)
    } else {
      const confirmations = await getConfirmations(commitTxHash)
      setConfirmations(confirmations)
    }
  }

  async function continueEtching() {
    const response = await fetch('/api/etch-rune', {
      body: JSON.stringify({ revealTxHash, commitTxHash }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
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
            at 70%.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={checkStatus}>Refresh</Button>
      </CardFooter>
    </Card>
  )
}
