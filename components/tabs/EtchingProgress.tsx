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
import { postRequest } from '@/app/utils/apiRequests'

type Props = {
  runeProps: FormData
  commitTxHash: string | null
  setRevealTxHash: (revealTxHash: string) => void
  revealTxHash: string | null
  etchedFinished: boolean
  setEtchedFinished: (etchedFinished: boolean) => void
}

export default function EtchingProgress({
  runeProps,
  commitTxHash,
  setRevealTxHash,
  revealTxHash,
  etchedFinished,
  setEtchedFinished,
}: Props): JSX.Element {
  const [commitConfirmations, setCommitConfirmations] = useState(0)
  const [progress, setProgress] = useState(0)
  const commitConfirmationsThreshold = 6
  const { name, symbol, address: owner } = runeProps

  useEffect(() => {
    updateStatus()
    const interval = setInterval(() => {
      updateStatus()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setProgress(
      Math.round((commitConfirmations / commitConfirmationsThreshold) * 100)
    )
    if (commitConfirmations >= commitConfirmationsThreshold) {
      executeRevealTxHash()
    }
  }, [commitConfirmations])

  async function updateStatus() {
    try {
      if (revealTxHash) {
        const confirmed = await isConfirmed(revealTxHash)
        //TODO show success message on the screen and execute factory contract
        setEtchedFinished(confirmed)
        if (confirmed) console.log('the rune has been etched')
      } else if (commitTxHash) {
        const confirmations = await getConfirmations(commitTxHash)
        setCommitConfirmations(confirmations)
      }
    } catch (error) {
      console.log('Error on updateStatus:', error)
    }
  }
  async function executeRevealTxHash() {
    try {
      localStorage.getItem('runeData')
      if (localStorage.getItem('runeData')) {
        let data = JSON.parse(localStorage.getItem('runeData')!)
        console.log(
          'revealTxHash in executeRevealTxHash:',
          data.scriptP2trAddress
        )
        console.log('commitTxHash in tapLeafScript:', data.tapLeafScript)

        const controlBlock = data.tapLeafScript[0].controlBlock.data

        const { revealTxHash } = await postRequest({
          action: 'revealTx',
          scriptP2trAddress: data.scriptP2trAddress,
          tapLeafScript: {
            ...data.tapLeafScript[0],
            controlBlock,
          },
          commitTxHash: data.commitTxHash,
          ...data.runeProps,
        })
        console.log('commitData:', revealTxHash)
        localStorage.setItem(
          'runeData',
          JSON.stringify({
            runeProps: data.runeProps,
            commitTxHash: data.commitTxHash,
            scriptP2trAddress: data.scriptP2trAddress,
            tapLeafScript: data.tapLeafScript,
            revealTxHash: revealTxHash,
          })
        )
        setRevealTxHash(revealTxHash)
      }
    } catch (error) {
      console.log('Error on executeRevealTxHash:', error)
    }
  }

  // async function updateStatus() {
  //   console.log('checking status')
  //   console.log('revealTxHash:', revealTxHash)
  //   if (revealTxHash) {
  //     // console.log('revealTxHash is for getting confirmations:', revealTxHash)
  //     // const confirmed = await isConfirmed(revealTxHash)
  //     // if (confirmed) {
  //     //   toast.success('Rune has been Etched!')
  //     //   //TODO show success message on the screen and execute factory contract
  //     // } else {
  //     //   const confirmations = await getConfirmations(revealTxHash)
  //     //   setConfirmations(confirmations)
  //     // }
  //   } else {
  //     const confirmations = await getConfirmations(commitTxHash)
  //     setConfirmations(confirmations)
  //     console.log('confirmations are:', confirmations)
  //     if (commitTxMatured) {

  //     } else {
  //       console.log('commitTxHash is for getting confirmations:', commitTxHash)
  //       if (confirmations >= confirmationsThreshold) {
  //         toast.success('Rune has been Etched!')
  //         setCommitTxMatured(true)
  //       }
  //     }
  //   }
  // }

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
        <Button>Etching Rune ...</Button>
      </CardFooter>
    </Card>
  )
}
