import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { formatAddress } from '@/lib/utils'
import {
  getConfirmations,
  isConfirmed,
  //@ts-ignore
} from 'bc-runes-js'
import { toast } from 'react-toastify'
import { postRequest } from '@/app/utils/apiRequests'
import {
  UseRuneERC1155Props,
  useRuneERC1155,
} from '@/app/utils/hooks/useRuneERC1155'

type Props = {
  mintTxHash: string | null
  setMintTxHash: (mintTxHash: string | null) => void
  mintFinished: boolean
  setMintFinished: (finished: boolean) => void
  runeProps: UseRuneERC1155Props
  commitTxHash: string | null
  setCommitTxHash: (commitTxHash: string) => void
  setRevealTxHash: (revealTxHash: string | null) => void
  revealTxHash: string | null
  etchedFinished: boolean
  setEtchedFinished: (etchedFinished: boolean) => void
}
export default function EtchingProgress({
  mintTxHash,
  setMintTxHash,
  mintFinished,
  setMintFinished,
  runeProps,
  commitTxHash,
  setCommitTxHash,
  setRevealTxHash,
  revealTxHash,
  etchedFinished,
  setEtchedFinished,
}: Props): JSX.Element {
  const [commitConfirmations, setCommitConfirmations] = useState(0)

  const commitConfirmationsThreshold = 6
  const [remainingCommitConfirmations, setRemainingCommitConfirmations] =
    useState(commitConfirmationsThreshold)

  const [progress, setProgress] = useState(0)
  const [etchedConfirmed, setEtchedConfirmed] = useState(false)

  const [updateStatusInterval, setUpdateStatusInterval] =
    useState<NodeJS.Timeout | null>(null)
  const { mintNonFungible, isTxConfirmed } = useRuneERC1155()

  const { uri, name, symbol, receiver } = runeProps

  const executeMinting = useCallback(async () => {
    try {
      if (!name || !symbol || !receiver) return

      const newRuneProps: UseRuneERC1155Props = {
        uri,
        receiver,
        name,
        symbol,
      }
      const { hash } = await mintNonFungible(newRuneProps)
      localStorage.setItem('mintTxHash', hash)
      setMintTxHash(hash)
    } catch (error) {
      console.log(error)
      toast.error('Error minting the rune')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const updateStatus = useCallback(async () => {
    try {
      if (mintTxHash) {
        const isConfirmed = await isTxConfirmed(mintTxHash)
        if (isConfirmed) {
          if (updateStatusInterval) clearInterval(updateStatusInterval!)
          toast.info(`Succesfully minted rune in tx ${mintTxHash}`)
          localStorage.removeItem('runeData')
          localStorage.removeItem('mintTxHash')
          setCommitTxHash('')
          setRevealTxHash('')
          setMintTxHash('')
          setMintFinished(true)
        }
      } else if (revealTxHash) {
        if (etchedConfirmed) return
        const confirmed = await isConfirmed(revealTxHash)
        setEtchedFinished(confirmed)

        if (confirmed) {
          toast.success(
            `The rune ${name} has been etched on Bitcoin. Now minting it on Rootstock.`
          )
          setEtchedConfirmed(true)
          executeMinting()
        }
      } else if (commitTxHash) {
        if (etchedConfirmed) return
        const confirmations = await getConfirmations(commitTxHash)
        setCommitConfirmations(confirmations)
        setRemainingCommitConfirmations(
          Math.max(0, commitConfirmationsThreshold - confirmations)
        )
      }
    } catch (error) {
      toast.error('Error updating the status of the etching process')
    }
  }, [etchedConfirmed, mintTxHash, commitTxHash, revealTxHash, executeMinting])

  const executeRevealTxHash = useCallback(async () => {
    try {
      if (localStorage.getItem('runeData')) {
        let data = JSON.parse(localStorage.getItem('runeData')!)
        const tapLeafScript = data.tapLeafScript.map((item: any) => ({
          controlBlock: Buffer.from(new Uint8Array(item.controlBlock.data)),
          leafVersion: item.leafVersion,
          script: Buffer.from(new Uint8Array(item.script.data)),
        }))
        const serializedTapLeafScript = tapLeafScript.map((item: any) => ({
          controlBlock: item.controlBlock.toString('base64'),
          leafVersion: item.leafVersion,
          script: item.script.toString('base64'),
        }))

        const { revealTxHash } = await postRequest('/api/etch-rune', {
          action: 'revealTx',
          scriptP2trAddress: data.scriptP2trAddress,
          tapLeafScript: serializedTapLeafScript,
          commitTxHash: data.commitTxHash,
          ...data.runeProps,
        })
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
      toast.error('Error executing the reveal transaction')
    }
  }, [setRevealTxHash])

  useEffect(() => {
    updateStatus()
    const interval = setInterval(() => {
      updateStatus()
    }, 10000)
    setUpdateStatusInterval(interval)
    return () => clearInterval(interval)
  }, [updateStatus])

  useEffect(() => {
    if (commitConfirmations > 0) {
      setProgress(
        Math.round((commitConfirmations / commitConfirmationsThreshold) * 100)
      )
    }
    if (!remainingCommitConfirmations) {
      executeRevealTxHash()
    }
  }, [commitConfirmations, executeRevealTxHash])

  const goToUrl = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <Card>
      <CardHeader className="space-x-20 w-50">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Owner</Label>
            <p className="text-lg font-medium">{formatAddress(receiver!)}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <p className="text-lg font-medium">{symbol}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Step 1. Commit transaction maturation</Label>
          <Progress className="w-full" value={progress} />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {revealTxHash
              ? etchedFinished
                ? 'Etching process has been confirmed successfully, proceeding with minting . . .'
                : `Commit transaction reached ${commitConfirmationsThreshold} confirmations, now waiting for the reveal transaction to be confirmed`
              : `(${remainingCommitConfirmations} confirmation${remainingCommitConfirmations > 1 ? 's' : ''} remaining)`}
          </p>
          {!etchedFinished && (
            <p
              className="text-sm text-blue-600 dark:text-gray-400 cursor-pointer"
              onClick={() =>
                goToUrl(
                  `${process.env.NEXT_PUBLIC_EXPLORER_URL}/${
                    revealTxHash ? `${revealTxHash}` : `${commitTxHash}`
                  }`
                )
              }
            >
              {`Follow ${revealTxHash ? 'reveal transaction' : 'commit transaction'} on Bitcoin explorer`}
            </p>
          )}
        </div>
        {etchedFinished && (
          <div className="space-y-2">
            <Label>Step 2. Minting Rune in Rootstock network Progress</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {"Creating your rune's token in the Rootstock network"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400"></p>
            {mintTxHash && !mintFinished && (
              <Fragment>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {'Waiting for minting transaction to be confirmed.'}
                </p>
                <p
                  className="text-sm text-blue-600 dark:text-gray-400 cursor-pointer"
                  onClick={() =>
                    goToUrl(
                      `${process.env.NEXT_PUBLIC_RSK_EXPLORER_URL}/${mintTxHash}`
                    )
                  }
                >
                  {'Follow minting transaction on Rootstock explorer'}
                </p>
              </Fragment>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="relative z-0 justify-end p-6">
        <Button
          className="mt-5 bg-white text-black"
          type="submit"
          disabled={true}
        >
          {etchedFinished ? 'Minting tokens on RSK' : 'Etching Rune ...'}
        </Button>
      </CardFooter>
    </Card>
  )
}
