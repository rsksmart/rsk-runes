'use client'

import { forwardRef, ChangeEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
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
import { TabsContent } from '@/components/ui/tabs'
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
  FormDescription,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  name: z
    .string()
    .min(13, {
      message: 'Name must be at least 13 characters.',
    })
    .max(24, {
      message: 'Name cannot exceed 24 characters.',
    }),
  symbol: z
    .string()
    .min(3, { message: 'Symbol must be at least 3 characters.' })
    .max(6, { message: 'Symbol cannot exceed 6 characters.' }),
  premine: z.string().min(0, { message: 'Premine is required.' }),
  amount: z.string().min(0, { message: 'Amount is required.' }),
  cap: z.string().min(0, { message: 'Cap is required.' }),
  divisibility: z.number().min(0, { message: 'Divisibility is required.' }),
  address: z
    .string()
    .min(3, { message: 'Symbol must be at least 3 characters.' })
    .max(6, { message: 'Symbol cannot exceed 6 characters.' }),
})

interface FormData {
  name: string
  symbol: string
  premine: number
  amount: number
  cap: number
  divisibility: number
  address: string
}

interface CustomInputProps {
  value: string
  onChange: (value: string) => void
  id: string
  placeholder: string
  className?: string
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onChange, id, placeholder, className }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value.toUpperCase()
      inputValue = inputValue.replace(/\s+/g, '•')
      inputValue = inputValue.replace(/•{2,}/g, '•')
      onChange(inputValue)
    }

    return (
      <Input
        ref={ref}
        value={value}
        onChange={handleChange}
        id={id}
        placeholder={placeholder}
        className={className}
      />
    )
  }
)

CustomInput.displayName = 'CustomInput'

export default function EtchTab(): JSX.Element {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    console.log(data)

    // const { name, symbol, premine, amount, cap, divisibility, address } = data

    //   const {
    //     txHash: commitTxHash,
    //     scriptP2trAddress,
    //     tapLeafScript,
    //   } = await commitTx({ name, "" })

    //   await waitForTxToMature(commitTxHash)

    //   const commitUtxo = await findUtxo(scriptP2trAddress, commitTxHash)
    //   commitUtxo.tapLeafScript = tapLeafScript

    //   console.log({ commitUtxo })

    //   const { txHash: revealTxHash } = await revealTx({
    //     input: {
    //       commitUtxo,
    //     },
    //     name,
    //     amount,
    //     cap,
    //     symbol,
    //     divisibility,
    //     premine,
    //     inscriptionContent,
    //   })

    //   await waitForTxToBeConfirmed(revealTxHash)

    //   return { revealTxHash }
  }

  return (
    <TabsContent value="etch" className="relative">
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Name
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
                          value={field.value}
                          onChange={field.onChange}
                          id="name"
                        />
                      </FormControl>
                      <FormDescription>
                        Name must be between 13 and 24 characters.
                      </FormDescription>
                      <FormMessage>
                        {form.formState.errors.name?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Symbol
                        <Tooltip>
                          <TooltipTrigger>
                            <CircleHelp className="w-4 h-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[200px]">
                              Symbol of the rune on RSK. e.g. &quot;UNG&quot;
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter token symbol"
                          id="symbol"
                          className="w-[300px]"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.symbol?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="premine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Premine
                        <Tooltip>
                          <TooltipTrigger>
                            <CircleHelp className="w-4 h-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[200px]">
                              Premined runes to the rune etcher.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter premine amount"
                          id="premine"
                          type="number"
                          className="w-[300px]"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.premine?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
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
                              The amount of runes each mint produces.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter token amount"
                          id="amount"
                          type="number"
                          className="w-[300px]"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.amount?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Cap
                        <Tooltip>
                          <TooltipTrigger>
                            <CircleHelp className="w-4 h-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[200px]">
                              Total amount of mints.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter token cap"
                          id="cap"
                          type="number"
                          className="w-[300px]"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.cap?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="divisibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Divisibility
                        <Tooltip>
                          <TooltipTrigger>
                            <CircleHelp className="w-4 h-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-[200px]">
                              The number of subunits in a super unit of runes.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter token divisibility"
                          id="divisibility"
                          type="number"
                          className="w-[300px]"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.divisibility?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Rootstock Address
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
                        placeholder="RSK address"
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
              <CardFooter className="px-0">
                <Button className="mt-5" type="submit">
                  Create Etch Token
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
