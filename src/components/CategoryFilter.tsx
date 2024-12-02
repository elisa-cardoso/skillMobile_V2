import { Button, Text } from '@gluestack-ui/themed';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof Button> & {
  name: string;
  isActive: boolean;
  onPress: () => void;
};

export function CategoryFilter({ name, isActive, onPress, ...props }: Props) {
  return (
    <Button
      mr="$3"
      minWidth="$24"
      h="$10"
      bg={isActive ? '$blueNeki600' : '$gray500'}
      rounded="$md"
      justifyContent="center"
      alignItems="center"
      onPress={onPress}
      sx={{
        ':active': {
          backgroundColor: '$blueNeki600',
        },
      }}
      {...props}
    >
      <Text color='$gray100' fontSize="$sm" fontFamily="$heading">
        {name}
      </Text>
    </Button>
  );
}
