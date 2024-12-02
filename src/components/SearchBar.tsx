import { Input } from "./Input";
interface SearchBarProps {
  onSearchChange: (text: string) => void;
  placeholder?: string;
  style?: object;
}

export function SearchBar({
  onSearchChange,
  placeholder = "Buscar por título",
  style,
}: SearchBarProps) {
  return (
    <Input placeholder={placeholder} onChangeText={onSearchChange} style={style} />
  );
}
