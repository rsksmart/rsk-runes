'use client'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '../ui/label'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CircleHelp } from 'lucide-react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { FormDataRuneToBTC } from '@/app/utils/types'
import { formSchemaRuneToBTC } from '@/app/utils/schemas'
import { useAuth } from '@/app/context/AuthContext'
import InputField from '../ui/InputField'
import { FreezeTxData, useRuneERC1155 } from '@/app/utils/hooks/useRuneERC1155'
import { toast } from 'react-toastify'
import {
  isConfirmed,
  //@ts-ignore
} from 'bc-runes-js'
import { getRequest, postRequest } from '@/app/utils/apiRequests'
import { ethers } from 'ethers'

export default function EtchRunesToRBTC() {
  const [updateStatusInterval, setUpdateStatusInterval] =
    useState<NodeJS.Timeout | null>(null)
  const [loading, setLoading] = useState(false)
  const [processingRuneTransfer, setProcessingRuneTransfer] = useState(false)
  const [transferWaiting, setTransferWaiting] = useState(false)
  const [processFinished, setProcessFinished] = useState(false)
  const [freezeTxHash, setFreezeTxHash] = useState<string | null>(null)
  const [transferTxHash, setTransferTxHash] = useState<string | null>(null)
  const { freezeNonFungible, txFreezeStatus } = useRuneERC1155()
  const { rune: runeToBTC } = useAuth()
  const form = useForm<FormDataRuneToBTC>({
    resolver: zodResolver(formSchemaRuneToBTC),
    defaultValues: {
      name: '',
      amount: '',
      address: '',
    },
  })

  useEffect(() => {
    const runeToBTCData = localStorage.getItem('runeToBTCData')
    const runeToBTCDataParsed: FreezeTxData = runeToBTCData
      ? JSON.parse(runeToBTCData)
      : null

    if (runeToBTCDataParsed) {
      //if the freeze process is already done
      if (runeToBTCDataParsed.transferRuneTxHash) {
        //if the transfer of the rune in btc is already in process
        setLoading(true)
        setTransferWaiting(true)
        setTransferWaiting(true)
      } else {
        //if the freeze on rsk is done but transfer  in btc is not started
        if (!runeToBTCDataParsed.runeName || !runeToBTCDataParsed.receiver) {
          console.error('No runeName or receiver found')
          toast.error('No runeName or receiver found')
          return
        }
        if (runeToBTCDataParsed.freezeTxHash)
          setFreezeTxHash(runeToBTCDataParsed.freezeTxHash)
        processBTCRuneSend(runeToBTCDataParsed)
      }
      setLoading(true)
    } else {
      //if there is not freeze on rsk process yet
      form.reset(runeToBTC)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = (data: FormDataRuneToBTC) => {
    console.log('data on form is', data)
    console.log('data amount on form is', data.amount)
    console.log('runeToBTC userbalance is', runeToBTC?.userBalance)
    console.log(
      'runeToBTC userbalance parsed is ',
      ethers.formatUnits(runeToBTC?.userBalance ?? '0', 18)
    )
    if (!runeToBTC?.userBalance) {
      toast.error('No balance found')
      return
    }
    if (
      Number(data.amount) >
      Number(ethers.formatUnits(runeToBTC?.userBalance ?? '0', 18))
    ) {
      toast.error('Amount is higher than your balance')
      return
    }
    processRSKFreeze(data)
  }
  const processRSKFreeze = async (data: FormDataRuneToBTC) => {
    setLoading(true)
    try {
      const freezeTxHash = await freezeNonFungible(data.name)
      const runeToBTCData: FreezeTxData = {
        runeName: data.name,
        amount: parseInt(data.amount),
        receiver: data.address,
        freezeTxHash,
      }
      localStorage.setItem('runeToBTCData', JSON.stringify(runeToBTCData))
      toast.success('Rune frozen successfully')
      processBTCRuneSend(runeToBTCData)
    } catch (error) {
      console.error('Error freezing rune: ', error)
      toast.error('Error freezing rune on RSK')
    }
  }
  const processBTCRuneSend = async (runeToBTCDataParsed: FreezeTxData) => {
    try {
      setProcessingRuneTransfer(true)
      if (!runeToBTCDataParsed.runeName) {
        console.error('No runeName found')
        toast.error('No runeName found')
        return
      }

      const response = await getRequest(
        `/api/transfer-rune?name=${runeToBTCDataParsed.runeName}&action=getIdByName`
      )
      const runeId = response.runeId

      if (!runeId) {
        console.error('No recipient address or rune id')
        toast.error('No recipient address or rune id found')
        return
      }
      if (!runeToBTCDataParsed) {
        console.error('No process found')
        toast.error('No process data found')
        return
      }
      if (!runeToBTCDataParsed.receiver) {
        console.error('No receiver found')
        toast.error('No receiver found')
        return
      }
      const transferRuneTxHash = await postRequest('/api/transfer-rune', {
        action: 'transferRune',
        amount: 1,
        to: runeToBTCDataParsed.receiver,
        runeId,
      })
      const hash = transferRuneTxHash?.txHash?.txHash
      const newRuneToBTCData = {
        ...runeToBTCDataParsed,
        transferRuneTxHash: hash,
      }
      setTransferTxHash(hash)
      localStorage.setItem('runeToBTCData', JSON.stringify(newRuneToBTCData))
      setTransferWaiting(true)
      toast.success('Rune transfer tx created, waiting for confirmation on BTC')
    } catch (error) {
      console.error('Error sending rune to BTC: ', error)
      toast.error('Error sending rune to BTC')
    }
  }
  const updateStatus = useCallback(async () => {
    try {
      const runeToBTCData = localStorage.getItem('runeToBTCData')
      const runeToBTCDataParsed: FreezeTxData = runeToBTCData
        ? JSON.parse(runeToBTCData)
        : null
      if (!runeToBTCDataParsed) return
      if (!transferWaiting || !runeToBTCDataParsed.transferRuneTxHash) return
      setTransferTxHash(runeToBTCDataParsed.transferRuneTxHash)
      const confirmed = await isConfirmed(
        runeToBTCDataParsed.transferRuneTxHash
      )
      if (confirmed) {
        toast.success('Rune transfer to BTC has been confirmed')
        setProcessFinished(true)
        form.reset()
        form.setValue('amount', '0')
        resetProcess()
      }
    } catch (error) {
      toast.error('Error reading process status, please refresh the page.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const resetProcess = () => {
    setTransferWaiting(false)
    setProcessingRuneTransfer(false)
    setLoading(false)
    if (updateStatusInterval) clearInterval(updateStatusInterval)
    setUpdateStatusInterval(null)
    localStorage.removeItem('runeToBTCData')
  }
  useEffect(() => {
    updateStatus()
    const interval = setInterval(() => {
      updateStatus()
    }, 10000)
    setUpdateStatusInterval(interval)
    return () => clearInterval(interval)
  }, [updateStatus, transferWaiting])
  const goToUrl = (url: string) => {
    window.open(url, '_blank')
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Runes to BTC</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-1 gap-4">
              <InputField
                form={form}
                name="name"
                placeholder="Enter rune name"
                tooltip='Name of the rune. e.g. "UNCOMMON•GOODS"'
                disabled
              />
            </div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Amount
                    <Tooltip>
                      <TooltipTrigger>
                        <CircleHelp className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[200px]">
                          Enter the amount of runes you want to send back to BTC
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={'Enter rune amount'}
                      id="amount"
                      type="number"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.amount?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <Fragment>
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      BTC Address
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleHelp className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-[200px]">
                            Enter the Rootstock address where runes will be
                            minted into ERC20s
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="BTC address"
                        id="address"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.address?.message}
                    </FormMessage>
                  </FormItem>
                </Fragment>
              )}
            />
            {loading && (
              <Fragment>
                <div className="space-y-2">
                  <Label>{'Step 1. Freeze Rune in Rootstock network.'}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {"Blocking your rune's token in the contract"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {`Status is ${freezeTxHash ? '--completed--' : (txFreezeStatus ?? '--starting--')}`}
                  </p>
                  {freezeTxHash && (
                    <Fragment>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {' Check status of your minting on RSK'}
                      </p>
                      <p
                        className="text-sm text-blue-600 dark:text-gray-400 cursor-pointer"
                        onClick={() =>
                          goToUrl(
                            `${process.env.NEXT_PUBLIC_RSK_EXPLORER_URL}/${freezeTxHash}`
                          )
                        }
                      >
                        {`${process.env.NEXT_PUBLIC_RSK_EXPLORER_URL}/${freezeTxHash}`}
                      </p>
                    </Fragment>
                  )}
                </div>
                {processingRuneTransfer && (
                  <Fragment>
                    <div className="space-y-2">
                      <Label>
                        Step 2. Transferring Rune in BTC network . . .
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {"Blocking your rune's token in the contract"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {`Status is ${transferWaiting ? '--Confirming transfer TX--' : '--Starting transfer--'}`}
                      </p>
                    </div>
                    {transferWaiting && transferTxHash && (
                      <Fragment>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {' Check status of the transfer on BTC'}
                        </p>
                        <p
                          className="text-sm text-blue-600 dark:text-gray-400 cursor-pointer"
                          onClick={() =>
                            goToUrl(
                              `${process.env.NEXT_PUBLIC_EXPLORER_URL}/${transferTxHash}`
                            )
                          }
                        >
                          {`${process.env.NEXT_PUBLIC_EXPLORER_URL}/${transferTxHash}`}
                        </p>
                      </Fragment>
                    )}
                  </Fragment>
                )}
              </Fragment>
            )}
            {processFinished && (
              <div className="space-y-2">
                <Label>Process Finished</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Rune has been successfully transferred to BTC
                </p>
              </div>
            )}
            <CardFooter className="px-0 relative z-0 justify-end">
              <Button
                className="mt-5 bg-white text-black"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Loading Tx' : 'Runes to BTC'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
