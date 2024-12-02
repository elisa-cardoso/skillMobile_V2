import React from "react";
import {
  VStack,
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from "@gluestack-ui/themed";
import { CheckIcon } from "lucide-react-native";

interface CategoryCheckboxGroupProps {
  categories: { name: string; id: number }[];
  value: string[];
  onChange: (selectedValues: string[]) => void;
}

export const CategoryCheckboxGroup: React.FC<CategoryCheckboxGroupProps> = ({
  categories,
  value,
  onChange,
}) => {
  return (
    <CheckboxGroup value={value} onChange={onChange}>
      <VStack space="xl">
        {categories.map((category) => (
          <Checkbox
            key={category.id}
            value={category.name}
            aria-label={`Selecionar categoria ${category.name}`}
          >
            <CheckboxIndicator $checked={{
                bg: '$green500',
                borderColor: '$green500'
              }}>
              <CheckboxIcon color="$white" as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel color="$white"  ml="$4">{category.name}</CheckboxLabel>
          </Checkbox>
        ))}
      </VStack>
    </CheckboxGroup>
  );
};
