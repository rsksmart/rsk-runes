'use client'
import { FormEvent, Fragment, useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '../ui/label'
import {
  Card,
  CardContent,
  CardDescription,
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
import { CustomInput } from './CustomInput'
import { FormData, FormDataRuneToBTC } from '@/app/utils/types'
import { formSchemaRuneToBTC } from '@/app/utils/schemas'
import { useAuth } from '@/app/context/AuthContext'
import InputField from '../ui/InputField'
import { FreezeTxData, useRuneERC1155 } from '@/app/utils/hooks/useRuneERC1155'
import { toast } from 'react-toastify'
import {
  getRuneIdByName,
  transferTx,
  isConfirmed,
  //@ts-ignore
} from 'bc-runes-js'
import { getRequest, postRequest } from '@/app/utils/apiRequests'

export default function EtchRunesToRBTC(): JSX.Element {
  const [updateStatusInterval, setUpdateStatusInterval] =
    useState<NodeJS.Timeout | null>(null)
  const [loading, setLoading] = useState(false)
  const [processingRuneTransfer, setProcessingRuneTransfer] = useState(false)
  const [transferWaiting, setTransferWaiting] = useState(false)
  const [processFinished, setProcessFinished] = useState(false)
  const [freezeTxData, setFreezeTxData] = useState<FreezeTxData | null>(null)
  const [recepientAddressBtc, setRecepientAddressBtc] = useState<string | null>(
    null
  )
  const { freezeNonFungible, txFreezeStatus } = useRuneERC1155()
  const { rune: runeToBTC } = useAuth()
  const form = useForm<FormDataRuneToBTC>({
    resolver: zodResolver(formSchemaRuneToBTC),
    defaultValues: {
      name: '',
      amount: '1',
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
      setFreezeTxData(runeToBTCDataParsed)
      console.log('runeToBTCDataParsed: ', runeToBTCDataParsed)
      if (runeToBTCDataParsed.transferRuneTxHash) {
        //if the transfer of the rune in btc is already in process
      } else {
        //if the freeze on rsk is done but transfer  in btc is not started
        processBTCRuneSend(runeToBTCDataParsed.runeName)
      }
      setLoading(true)
    } else {
      //if there is not freeze on rsk process yet
      console.log('runeToBTC: ', runeToBTC)
      form.reset(runeToBTC)
    }
  }, [])

  const onSubmit = (data: FormDataRuneToBTC) => {
    console.log('Form data submitted: ', data)
    setRecepientAddressBtc(data.address)
    processRSKFreeze(data)
  }
  const processRSKFreeze = async (data: FormDataRuneToBTC) => {
    setLoading(true)
    try {
      const freezeTxHash = await freezeNonFungible(data.name)
      console.log('freezeTxHash: ', freezeTxHash)
      const runeToBTCData: FreezeTxData = {
        runeName: data.name,
        amount: parseInt(data.amount),
        receiver: data.address,
        freezeTxHash,
      }
      setFreezeTxData(runeToBTCData)
      localStorage.setItem('runeToBTCData', JSON.stringify(runeToBTCData))
    } catch (error) {
      console.error('Error freezing rune: ', error)
      toast.error('Error freezing rune on RSK')
    } finally {
      toast.success('Rune frozen successfully')
      processBTCRuneSend(data.name)
    }
  }
  const processBTCRuneSend = async (name: string) => {
    try {
      console.log('entering to processBTCRuneSend')

      setProcessingRuneTransfer(true)
      const response = await getRequest(
        `/api/transfer-rune?name=${name}&action=getIdByName`
      )
      console.log('runeId is: ', response.runeId)
      const runeId = response.runeId
      const transferRuneTxHash = await postRequest('/api/transfer-rune', {
        action: 'transferRune',
        amount: 1,
        to: recepientAddressBtc,
        runeId,
      })
      console.log('transferRuneTxHash: ', transferRuneTxHash)
      localStorage.setItem(
        'runeToBTCData',
        JSON.stringify({ ...freezeTxData, transferRuneTxHash })
      )
    } catch (error) {
      console.error('Error sending rune to BTC: ', error)
      toast.error('Error sending rune to BTC')
    } finally {
      setTransferWaiting(true)
    }
  }
  const updateStatus = useCallback(async () => {
    try {
      if (!transferWaiting || !freezeTxData?.transferRuneTxHash) return
      const confirmed = await isConfirmed(freezeTxData?.transferRuneTxHash)
      if (confirmed) {
        toast.success('Rune transfer to BTC has been confirmed')
        setProcessFinished(true)
        form.reset()
        form.setValue('amount', '0')
        resetProcess()
      }
    } catch (error) {
      console.log('Error updating status: ', error)
      toast.error('Error reading process status, please refresh the page.')
    }
  }, [])
  const resetProcess = () => {
    setFreezeTxData(null)
    setRecepientAddressBtc(null)
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
        {/* <CardDescription>runes a new rune.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                form={form}
                name="name"
                placeholder="Enter rune name"
                tooltip='Name of the rune. e.g. "UNCOMMON•GOODS"'
                disabled
              />
              <InputField
                form={form}
                name="amount"
                placeholder="Enter rune amount"
                tooltip="Amount of the rune."
                disabled
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    BTC Address
                    <Tooltip>
                      <TooltipTrigger>
                        <CircleHelp className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[200px]">
                          Enter the Rootstock address where runes will be minted
                          into ERC20s
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
                    {`Status is ${freezeTxData?.freezeTxHash ? '--completed--' : txFreezeStatus ?? '--starting--'}`}
                  </p>
                  {freezeTxData?.freezeTxHash && (
                    <Fragment>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {' Check status of your minting on RSK'}
                      </p>
                      <p
                        className="text-sm text-blue-600 dark:text-gray-400 cursor-pointer"
                        onClick={() =>
                          goToUrl(
                            `${process.env.NEXT_PUBLIC_RSK_EXPLORER_URL}/${freezeTxData?.freezeTxHash}`
                          )
                        }
                      >
                        {`${process.env.NEXT_PUBLIC_RSK_EXPLORER_URL}/${freezeTxData?.freezeTxHash}`}
                      </p>
                    </Fragment>
                  )}
                </div>
                {processingRuneTransfer && (
                  <div className="space-y-2">
                    <Label>
                      Step 2. Transferring Rune in BTC network . . .
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {"Blocking your rune's token in the contract"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {`Status is ${transferWaiting ? '--completed--' : '--transferring--'}`}
                    </p>
                  </div>
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
                className="mt-5 bg-white text-black before:w-[120px]"
                type="submit"
                variant={'outline'}
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
