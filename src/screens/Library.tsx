import { ScreenHeader } from '@components/ScreenHeader'
import { VStack } from '@gluestack-ui/themed'
export function Library() {
  return (
    <VStack flex={1}>
      <ScreenHeader title='Minha biblioteca' />
    </VStack>
  )
}