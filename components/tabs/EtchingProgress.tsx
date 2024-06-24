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
import { Fragment, useCallback, useEffect, useState } from 'react'
import { formatAddress } from '@/lib/utils'
import { FormData } from '@/app/utils/types'
// @ts-ignore
import { getConfirmations, isConfirmed } from 'bc-runes-js'
import { toast } from 'react-toastify'
import { postRequest } from '@/app/utils/apiRequests'
import { UseRuneERC20Props, useRuneERC20 } from '@/app/utils/hooks/useRuneERC20'
import { ethers } from 'ethers'

type Props = {
  runeProps: FormData
  commitTxHash: string | null
  setRevealTxHash: (revealTxHash: string | null) => void
  setCommitTxHash: (commitTxHash: string | null) => void
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
  setCommitTxHash,
}: Props): JSX.Element {
  const [commitConfirmations, setCommitConfirmations] = useState(0)
  const [progress, setProgress] = useState(0)
  const [etchedConfirmed, setEtchedConfirmed] = useState(false)
  const [erc20AddressRequested, setErc20AddressRequested] = useState(false)
  const [newRuneProps, setNewRuneProps] = useState<UseRuneERC20Props>({
    name: '',
    symbol: '',
    initialSupply: ethers.parseUnits('0', 18),
    initialOwner: '',
    runeID: '',
    _mintAmount: ethers.parseUnits('0', 18),
    _maxSupply: ethers.parseUnits('0', 18),
  })
  const [updateStatusInterval, setUpdateStatusInterval] =
    useState<NodeJS.Timeout | null>(null)
  const commitConfirmationsThreshold = 6
  const {
    tokenAddress,
    getTokenAddress,
    createRune,
    loadingCreateRune,
    txStatus, //posible states are: 'pending', 'success', 'error'
    createdReceipt,
    txHash,
  } = useRuneERC20(newRuneProps)
  const {
    name,
    symbol,
    address: owner,
    premine,
    amount,
    cap,
    divisibility,
  } = runeProps

  const executeMinting = useCallback(async () => {
    try {
      console.log('minting rune')
      if (updateStatusInterval) clearInterval(updateStatusInterval!)
      if (!name || !symbol || !owner || !premine || !amount || !cap) return
      const newRuneProps: UseRuneERC20Props = {
        name: name,
        symbol: symbol,
        initialSupply: ethers.parseUnits(premine.toString(), 18),
        initialOwner: owner,
        runeID: '1',
        _mintAmount: ethers.parseUnits(amount.toString(), 18),
        _maxSupply: ethers.parseUnits(cap.toString(), 18),
      }
      setNewRuneProps(newRuneProps)
    } catch (error) {
      toast.error('Error minting the rune')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (newRuneProps.name !== '' && (!erc20AddressRequested || !tokenAddress)) {
      console.log('new token address inside wrong request is ', tokenAddress)
      getTokenAddress()
      console.log('getting token address')
      setErc20AddressRequested(true)
    }
    if (tokenAddress && !loadingCreateRune) {
      console.log('new token address is ', tokenAddress)
      createRune()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRuneProps, tokenAddress])

  const updateStatus = useCallback(async () => {
    try {
      console.log('updating status call')

      if (etchedConfirmed) return
      if (revealTxHash) {
        const confirmed = await isConfirmed(revealTxHash)
        setEtchedFinished(confirmed)
        console.log('is confirmed?', confirmed)
        if (confirmed) {
          toast.success('Etching process has been confirmed successfully')
          setEtchedConfirmed(true)
          toast.info('Proceeding with minting . . .')
          executeMinting()
        }
      } else if (commitTxHash) {
        const confirmations = await getConfirmations(commitTxHash)
        setCommitConfirmations(confirmations)
      }
    } catch (error) {
      toast.error('Error updating the status of the etching process')
    }
  }, [
    revealTxHash,
    commitTxHash,
    setEtchedFinished,
    etchedConfirmed,
    executeMinting,
  ])

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

        const { revealTxHash } = await postRequest({
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
    setProgress(
      Math.round((commitConfirmations / commitConfirmationsThreshold) * 100)
    )
    if (commitConfirmations >= commitConfirmationsThreshold) {
      executeRevealTxHash()
    }
  }, [commitConfirmations, executeRevealTxHash])

  const goToUrl = (url: string) => {
    window.open(url, '_blank')
  }
  const newRune = () => {
    const localData = JSON.parse(localStorage.getItem('runeData')!)
    const newRuneCreated = {
      ...localData,
      tokenAddressRSK: tokenAddress,
      txHashRSK: txHash,
      txReceiptRSK: createdReceipt,
    }
    const prevRunes = JSON.parse(localStorage.getItem('runesHistory')!)
    localStorage.setItem(
      'runesHistory',
      prevRunes
        ? JSON.stringify([...prevRunes, newRuneCreated])
        : JSON.stringify([newRuneCreated])
    )
    localStorage.removeItem('runeData')
    setCommitTxHash(null)
    setRevealTxHash(null)
    setEtchedFinished(false)
    setErc20AddressRequested(false)
    setNewRuneProps({
      name: '',
      symbol: '',
      initialSupply: ethers.parseUnits('0', 18),
      initialOwner: '',
      runeID: '',
      _mintAmount: ethers.parseUnits('0', 18),
      _maxSupply: ethers.parseUnits('0', 18),
    })
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
              : `The Etching progress is currently at ${progress > 100 ? 100 : progress}%. (6 confirmations are needed)`}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {' Check status of your TX on'}
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
              {`${process.env.NEXT_PUBLIC_EXPLORER_URL}/${
                revealTxHash ? `${revealTxHash}` : `${commitTxHash}`
              }`}
            </p>
          )}
        </div>
        {etchedFinished && (
          <div className="space-y-2">
            <Label>Step 2. Minting Rune in Rootstock network Progress</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {"Creating your rune's token in the Rootstock network"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {`Minting status is --${txStatus ?? 'starting'}--`}
            </p>
            {txHash && txStatus !== 'success' && (
              <Fragment>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {' Check status of your minting on RSK'}
                </p>
                <p
                  className="text-sm text-blue-600 dark:text-gray-400 cursor-pointer"
                  onClick={() =>
                    goToUrl(
                      `${process.env.NEXT_PUBLIC_RSK_EXPLORER_URL}/${txHash}`
                    )
                  }
                >
                  {`${process.env.NEXT_PUBLIC_RSK_EXPLORER_URL}/${txHash}`}
                </p>
              </Fragment>
            )}
            {txStatus === 'success' && createdReceipt && (
              <Fragment>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {'Your rune has been minted successfully'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {' Your new token address is'}
                </p>
                <p className="text-sm text-blue-600 dark:text-gray-400 cursor-pointer">
                  {tokenAddress ?? "Couldn't get token address"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {' Check TX of your minting on RSK'}
                </p>
                <p
                  className="text-sm text-blue-600 dark:text-gray-400 cursor-pointer"
                  onClick={() =>
                    goToUrl(
                      `${process.env.NEXT_PUBLIC_RSK_EXPLORER_URL}/${createdReceipt.hash}`
                    )
                  }
                >
                  {`${process.env.NEXT_PUBLIC_RSK_EXPLORER_URL}/${createdReceipt.hash}`}
                </p>
              </Fragment>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="relative z-0 justify-end p-6">
        {txStatus === 'success' && createdReceipt ? (
          <Button
            className="mt-5 bg-white text-black"
            type="submit"
            onClick={newRune}
          >
            {'Create a new rune'}
          </Button>
        ) : (
          <Button
            className="mt-5 bg-white text-black"
            type="submit"
            disabled={true}
          >
            {etchedFinished ? 'Minting tokens on RSK' : 'Etching Rune ...'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
