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
import { StackRoutes } from "@routes/stack.routes";
import { StackNavigationProp } from "@react-navigation/stack";

interface PostCardProps {
  skills: Skills[];
}

export function PostCard({ skills }: PostCardProps) {
  const navigation =
    useNavigation<StackNavigationProp<StackRoutes, "skillDetails">>(); 

  const goToDetails = (id: string) => {
    navigation.navigate("skillDetails", { id });
  };

  return (
    <FlatList
      data={skills}
      keyExtractor={(skill) => skill.id.toString()}
      renderItem={({ item: skill }) => (
        <TouchableOpacity
          onPress={() => goToDetails(skill.id.toString())}
        >
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
    />
  );
}
