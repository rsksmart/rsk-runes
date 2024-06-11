import { Input } from '@/components/ui/input'
import { ChangeEvent, forwardRef } from 'react'

interface CustomInputProps {
  value?: string
  onChange: (value: string) => void
  id: string
  placeholder: string
  className?: string
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
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
