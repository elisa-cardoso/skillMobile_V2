import { Input as GluestackInput, InputField } from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type Props = ComponentProps<typeof InputField>

export function Input({ ...props }: Props) {
  return (
    <GluestackInput
      bg="$gray700"
      h="$14"
      px="$4"
      borderWidth="$1"
      borderColor='$gray400'
      borderRadius="$lg"
      $focus={{ borderWidth: 1, borderColor: '$green500' }}
    >
      <InputField
        color="$white"
        fontFamily="$body"
        placeholderTextColor="$gray300"
        {...props}
      />
    </GluestackInput>
  )
}