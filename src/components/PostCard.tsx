import { useNavigation } from "@react-navigation/native";
import { FlatList, TouchableOpacity } from "react-native";
import {
  HStack,
  Image,
  Text,
  VStack,
  Heading,
  Icon,
} from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";
import { Skills } from "../@types/skills";
import { StackNavigationProp } from "@react-navigation/stack";
import { Pagination } from "./Pagination";
import { SearchBar } from "./SearchBar";
import { SortDropdown } from "./SortDropdown";
import { HomeStackRoutes } from "@routes/stack.routes";

interface PostCardProps {
  skills: Skills[];
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSortChange: (sortDirection: string) => void;
  onSearchTitleChange: (title: string) => void;
}

export function PostCard({
  skills,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onSortChange,
  onSearchTitleChange,
}: PostCardProps) {
  const navigation =
    useNavigation<StackNavigationProp<HomeStackRoutes, "homeSkillDetails">>();

  const goToDetails = (id: string) => {
    navigation.navigate("homeSkillDetails", { id });
  };

  const handleSortChange = (value: string) => {
    onSortChange(value);
  };

  return (
    <VStack style={{flex: 1}}>
      <HStack justifyContent="space-between" gap="$3" px="$5" mb="$4">
        <SearchBar
          onSearchChange={onSearchTitleChange}
          placeholder="Buscar habilidade..."
          style={{ flex: 1 }}
        />
        <SortDropdown onSortChange={onSortChange} />
      </HStack>
      <FlatList
        data={skills}
        keyExtractor={(skill) => skill.id.toString()}
        renderItem={({ item: skill }) => (
          <TouchableOpacity onPress={() => goToDetails(skill.id.toString())}>
            <HStack
              borderWidth="$1"
              borderColor="$gray400"
              alignItems="center"
              p="$2"
              pr="$4"
              rounded="$md"
              mb="$3"
              mx="$5"
            >
              <Image
                source={{ uri: skill.image }}
                alt={`Imagem de ${skill.title}`}
                w="$16"
                h="$16"
                rounded="$md"
                mr="$4"
                resizeMode="cover"
              />
              <VStack flex={1}>
                <Heading fontSize="$lg" color="$white" fontFamily="$heading">
                  {skill.title}
                </Heading>
                <Text
                  fontSize="$sm"
                  color="$gray200"
                  mt="$1"
                  mb="$2"
                  mr="$4"
                  numberOfLines={2}
                >
                  {skill.description}
                </Text>
              </VStack>
              <Icon as={ChevronRight} color="$gray300" />
            </HStack>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
          />
        }
      />
    </VStack>
  );
}
