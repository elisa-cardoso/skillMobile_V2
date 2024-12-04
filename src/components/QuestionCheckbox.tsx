import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from "@gluestack-ui/themed";
import { CheckIcon } from "lucide-react-native";
import { Text } from "@gluestack-ui/themed";

interface SimpleCheckboxProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const QuestionCheckbox: React.FC<SimpleCheckboxProps> = ({
  value,
  label,
  checked,
  onChange,
}) => {
  return (
    <CheckboxGroup value={checked ? [value] : []} onChange={(newValue) => onChange(newValue.length > 0)}>
      <Checkbox value={value} aria-label={label} isChecked={checked} onChange={() => onChange(!checked)}>
        <CheckboxIndicator
          $checked={{
            bg: '$green500',
            borderColor: '$green500',
          }}
        >
          <CheckboxIcon color="$white" as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel ml="$4" mr="$2">
          <Text fontSize="$md" color="$white">{label}</Text>
          </CheckboxLabel>
      </Checkbox>
    </CheckboxGroup>
  );
};
