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
import { FormData } from '@/app/utils/types'
import { formSchema } from '@/app/utils/schemas'
export default function EtchRunesToRBTC(): JSX.Element {
  const [loading, setLoading] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: 0,
      address: '',
    },
  })

  const onSubmit = (data: FormData) => {
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      amount
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleHelp className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-[200px]">
                            Amount of the rune.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter runes amount"
                        id="amount"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.symbol?.message}
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
            <CardFooter className="px-0 relative z-0 justify-end">
              <Button
                className="mt-5 bg-white text-black before:w-[120px]"
                type="submit"
                variant={'outline'}
                disabled={loading}
              >
                {loading ? 'Loading' : 'Runes to BTC'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
