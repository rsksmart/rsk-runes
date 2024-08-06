import React from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { CircleHelp } from 'lucide-react'
import { Input } from './input'

type props = {
  form: any
  name: string
  type?: string
  placeholder: string
  tooltip: string
  disabled?: boolean
  userBalance?: string | null | undefined
}

function InputField({
  form,
  tooltip,
  name,
  placeholder,
  type = 'text',
  disabled = false,
  userBalance = null,
}: props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            <span className={`capitalize ${disabled ? 'opacity-50' : ''}`}>
              {name}
            </span>
            <Tooltip>
              <TooltipTrigger>
                <CircleHelp className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px]">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={userBalance ?? placeholder}
              type={type}
              id={name}
              disabled={disabled}
              onChange={(e) =>
                field.onChange(
                  type === 'number' ? e.target.valueAsNumber : e.target.value
                )
              }
            />
          </FormControl>
          <FormMessage>{form.formState.errors[name]?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}

export default InputField
