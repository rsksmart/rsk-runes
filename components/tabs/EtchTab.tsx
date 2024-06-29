'use client'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CircleHelp } from 'lucide-react'
import { Form, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { EtchTabProps, FormData } from '@/app/utils/types'
import { formSchema } from '@/app/utils/schemas'
import { toast } from 'react-toastify'
import { postRequest, getRequest } from '@/app/utils/apiRequests'
import InputField from '../ui/InputField'
import { UseRuneERC1155Props } from '@/app/utils/hooks/useRuneERC1155'
import { useAuth } from '@/app/context/AuthContext'

export default function EtchTab({
  setRuneProps,
  setCommitTxHash,
}: EtchTabProps): JSX.Element {
  const [loading, setLoading] = useState(false)
  const form = useForm<UseRuneERC1155Props>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      symbol: '',
      premine: 1,
      amount: 1,
      cap: 0,
      divisibility: 0,
      receiver: '',
    },
  })
  const { address: walletAddress } = useAuth()

  const [isNft, setIsNft] = useState<boolean>(true)

  const onSubmit = (data: UseRuneERC1155Props) => {
    setRuneProps(data)
    localStorage.setItem('runeData', JSON.stringify({ runeProps: data }))
    handleEtch(data)
  }

  useEffect(() => {
    form.setValue('receiver', walletAddress)
  }, [])
  const handleEtch = async (data: FormData) => {
    try {
      setLoading(true)

      console.log('Etching rune:', data.name)
      const response = await getRequest(
        `/api/etch-rune?name=${data.name}&action=getByname`
      )
      if (response.hasRuneByID) {
        toast.error('Rune already exists. Please choose a different name.')
        setLoading(false)
        return
      } else {
        toast.success('Rune does not exist. Proceeding with etching.')
      }
      if (!data.name) {
        toast.error('Name is required')
        setLoading(false)
        return
      }
      const commitData = await postRequest('/api/etch-rune', {
        name: data.name,
        action: 'commitTx',
      })
      console.log('commitData', commitData)
      const { commitTxHash, scriptP2trAddress, tapLeafScript } = commitData
      console.log('committxhash after commit:', commitTxHash)
      console.log('scriptP2trAddress after commit:', scriptP2trAddress)
      console.log('tapLeafScript after commit:', tapLeafScript)
      setCommitTxHash(commitTxHash)
      localStorage.setItem(
        'runeData',
        JSON.stringify({
          runeProps: data,
          commitTxHash,
          scriptP2trAddress,
          tapLeafScript,
        })
      )
    } catch (error) {
      console.error('Error etching rune:', error)
      toast.error('Error etching rune')
      setLoading(false)
    }
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Etch</CardTitle>
          <CardDescription>Etch a new rune.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  NFT
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleHelp className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[200px]">NFT</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <label className="flex relative items-center cursor-pointer">
                      <input
                        disabled
                        checked={isNft}
                        type="checkbox"
                        className="sr-only"
                        onChange={(e) => setIsNft(Boolean(e.target.checked))}
                      />
                      <span className="w-11 h-6 bg-card rounded-full border border-input toggle-bg"></span>
                    </label>
                  </div>
                </FormControl>
              </FormItem>
              <div className="grid md:grid-cols-3 gap-4">
                <InputField
                  form={form}
                  name="name"
                  tooltip={`Name of the rune. e.g. "$"`}
                  placeholder="Enter rune name"
                />
                <InputField
                  form={form}
                  name="symbol"
                  tooltip={`Symbol of the rune. e.g. "$"`}
                  placeholder="Enter token symbol"
                />
                <InputField
                  form={form}
                  name="premine"
                  tooltip="Premined runes to the rune etcher."
                  placeholder="Enter premine amount"
                  type="number"
                  disabled={isNft}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <InputField
                  form={form}
                  name="amount"
                  tooltip="The amount of runes each mint produces."
                  placeholder="Enter token amount"
                  type="number"
                  disabled={isNft}
                />
                <InputField
                  form={form}
                  name="cap"
                  tooltip="Total amount of mints."
                  placeholder="Enter token cap"
                  type="number"
                  disabled={isNft}
                />
                <InputField
                  form={form}
                  name="divisibility"
                  tooltip="The number of subunits in a super unit of runes."
                  placeholder="Enter token divisibility"
                  type="number"
                  disabled={isNft}
                />
              </div>
              <InputField
                form={form}
                name="receiver"
                tooltip="Enter the Rootstock address where runes will be minted into ERC20s"
                placeholder="RSK address"
                disabled={isNft}
              />
              <CardFooter className="px-0 relative z-0 justify-end">
                <Button
                  className="mt-5 bg-white text-black before:w-[104px]"
                  type="submit"
                  variant={'outline'}
                  disabled={loading}
                >
                  {loading ? 'Loading' : 'Etch Token'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
