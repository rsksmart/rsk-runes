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
import { useCallback, useEffect, useState } from 'react'
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

  const updateStatus = useCallback(async () => {
    try {
      console.log('revealTxHash on callback is', revealTxHash)
      if (revealTxHash) {
        const confirmed = await isConfirmed(revealTxHash)
        //TODO show success message on the screen and execute factory contract
        setEtchedFinished(confirmed)
        console.log('is confirmed?', confirmed)
        if (confirmed) console.log('the rune has been etched')
      } else if (commitTxHash) {
        console.log('commitTxHash in updateStatus:', commitTxHash)

        const confirmations = await getConfirmations(commitTxHash)
        setCommitConfirmations(confirmations)
      }
    } catch (error) {
      console.log('Error on updateStatus:', error)
    }
  }, [revealTxHash, commitTxHash, setEtchedFinished])

  const executeRevealTxHash = useCallback(async () => {
    try {
      if (localStorage.getItem('runeData')) {
        let data = JSON.parse(localStorage.getItem('runeData')!)
        console.log(
          'revealTxHash in executeRevealTxHash:',
          data.scriptP2trAddress
        )
        console.log('commitTxHash in tapLeafScript:', data.tapLeafScript)

        const tapLeafScript = data.tapLeafScript.map((item: any) => ({
          controlBlock: Buffer.from(new Uint8Array(item.controlBlock.data)),
          leafVersion: item.leafVersion,
          script: Buffer.from(new Uint8Array(item.script.data)),
        }))

        // Serializar los buffers a base64 para asegurarse de que se envíen correctamente
        const serializedTapLeafScript = tapLeafScript.map((item: any) => ({
          controlBlock: item.controlBlock.toString('base64'),
          leafVersion: item.leafVersion,
          script: item.script.toString('base64'),
        }))

        const { revealTxHash } = await postRequest({
          action: 'revealTx',
          scriptP2trAddress: data.scriptP2trAddress,
          tapLeafScript: serializedTapLeafScript,
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
  }, [setRevealTxHash])

  useEffect(() => {
    updateStatus()
    const interval = setInterval(() => {
      updateStatus()
    }, 10000)

    return () => clearInterval(interval)
  }, [updateStatus])

  useEffect(() => {
    setProgress(
      Math.round((commitConfirmations / commitConfirmationsThreshold) * 100)
    )
    if (commitConfirmations >= commitConfirmationsThreshold) {
      executeRevealTxHash()
    }
  }, [commitConfirmations, executeRevealTxHash])

  async function continueEtching() {
    console.log('ON continue etching')
  }

  return (
    <Card>
      <CardHeader className="space-x-20 w-50">
        <CardTitle>{name}</CardTitle>
        <CardDescription className="text-left w-100">
          Information about the rune: {name}.
        </CardDescription>
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
          <Label>Step 1. Etching Progress</Label>
          <Progress className="w-full" value={progress} />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {revealTxHash
              ? etchedFinished
                ? 'Etching process has been confirmed successfully, proceeding with minting . . .'
                : 'The Etching process has been completed, waiting for confirmation . . .'
              : `The Etching progress is currently at ${progress > 100 ? 100 : progress}%.`}
          </p>
        </div>
        {etchedFinished && (
          <div className="space-y-2">
            <Label>Step 2. Minting Rune in Rootstock network Progress</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {"Creating your rune's token in the Rootstock network"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className='relative z-0 justify-end p-6'>
        <Button
          variant={'outline'}
          className='bg-white text-black before:w-[130px]'
        >
          {etchedFinished ? 'Minting tokens' : 'Etching Rune ...'}
        </Button>
      </CardFooter>
    </Card>
  )
}
