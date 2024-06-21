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
import { EtchTabProps, FormData } from '@/app/utils/types'
import { formSchema } from '@/app/utils/schemas'
import { toast } from 'react-toastify'
import { postRequest, getRequest } from '@/app/utils/apiRequests'
import {
  init,
  // @ts-ignore
} from 'bc-runes-js'
import InputField from '../ui/InputField'
export default function EtchTab({
  setRuneProps,
  setCommitTxHash,
}: EtchTabProps): JSX.Element {
  const [loading, setLoading] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nft: 'false',
      name: '',
      symbol: '',
      premine: 0,
      amount: 0,
      cap: 0,
      divisibility: 0,
      address: '',
    },
  })

  const onSubmit = (data: FormData) => {
    setRuneProps(data)
    localStorage.setItem('runeData', JSON.stringify({ runeProps: data }))
    handleEtch(data)
  }

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
      const commitData = await postRequest({
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
    <Card>
      <CardHeader>
        <CardTitle>Etch</CardTitle>
        <CardDescription>Etch a new rune.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nft"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    NFT
                    <Tooltip>
                      <TooltipTrigger>
                        <CircleHelp className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-[200px]">
                          Name of the rune. e.g. &quot;UNCOMMON•GOODS&quot;
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <CustomInput
                      {...field}
                      placeholder="Enter rune name"
                      value={field.value!}
                      onChange={field.onChange}
                      id="nft"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                form={form}
                name='name'
                tooltip={`Name of the rune. e.g. "$"`}
                placeholder='Enter rune name'
              />
              <InputField
                form={form}
                name='symbol'
                tooltip={`Symbol of the rune. e.g. "$"`}
                placeholder='Enter token symbol'
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                form={form}
                name='premine'
                tooltip='Premined runes to the rune etcher.'
                placeholder='Enter premine amount'
                type='number'
              />
              <InputField
                form={form}
                name='amount'
                tooltip='The amount of runes each mint produces.'
                placeholder='Enter token amount'
                type='number'
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                form={form}
                name='cap'
                tooltip='Total amount of mints.'
                placeholder='Enter token cap'
                type='number'
              />
              <InputField
                form={form}
                name='divisibility'
                tooltip='The number of subunits in a super unit of runes.'
                placeholder='Enter token divisibility'
                type='number'
              />
            </div>
            <InputField
              form={form}
              name='address'
              tooltip='Enter the Rootstock address where runes will be minted into ERC20s'
              placeholder='RSK address'
            />
            <CardFooter className="px-0 relative z-0 justify-end">
              <Button
                className="mt-5 bg-white text-black before:w-[106px]"
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
  )
}
