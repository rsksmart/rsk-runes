'use client'

import {
  commitTx,
  waitForTxToMature,
  revealTx,
  findUtxo,
  waitForTxToBeConfirmed,
  getRuneIdByName,
} from 'bc-runes-js'
import { forwardRef, ChangeEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name must be at least 1 characters.',
    })
    .max(24, {
      message: 'Name cannot exceed 24 characters.',
    }),
  symbol: z
    .string()
    .length(1, { message: 'Symbol must be a single character.' }),
  premine: z.string(),
  amount: z.string().min(0, { message: 'Amount is required.' }),
  cap: z.string().min(0, { message: 'Cap is required.' }),
  divisibility: z
    .string()
    .max(38, { message: 'Divisibility cannot be higher than 38.' }),
  address: z
    .string()
    .length(42, { message: 'Address cannot exceed 42 characters.' }),
})

export interface FormData {
  name?: string
  symbol?: string
  premine?: number
  amount?: number
  cap?: number
  divisibility?: number
  address?: string
}

interface CustomInputProps {
  value?: string
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

interface Props {
  setRuneProps: Function
  setRevealTxHash: Function
  setCommitTxHash: Function
}

export default function EtchTab({
  setRuneProps,
  setRevealTxHash,
  setCommitTxHash,
}: Props): JSX.Element {
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

  const onSubmit = async (data: FormData) => {
    setRuneProps(data)

    try {
      const response = await fetch('/api/etch-rune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        console.log('Error:', error.error)
        return
      }

      const result = await response.json()
      console.log(result)
    } catch (error) {
      console.log('Error on submit:', error)
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
                            Symbol of the rune. e.g. &quot;$&quot;
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
                          Enter the Rootstock address where runes will be minted
                          into ERC20s
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
                Etch Token
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
