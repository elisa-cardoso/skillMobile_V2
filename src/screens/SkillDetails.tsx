import { useNavigation, useRoute } from "@react-navigation/native";
import {
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Box,
  Icon,
} from "@gluestack-ui/themed";
import { ArrowLeft, Edit } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import { Button } from "@components/Button";
import { useEffect, useState } from "react";
import { getSkillById } from "@services/SkillServices";
import { Skills } from "../@types/skills";
import { MarkdownRenderer } from "@components/Markdown";
import { StackRoutes } from "@routes/stack.routes";
import { StackNavigationProp } from "@react-navigation/stack";

export function SkillDetails() {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<StackRoutes, "skillEdit">>();
  
  const { id } = route.params as { id: string };

  const [skill, setSkill] = useState<Skills | null>(null);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const skillData = await getSkillById(Number(id));
        setSkill(skillData);
      } catch (error) {
        console.error("Erro ao carregar detalhes da skill:", error);
      }
    };

    fetchSkill();
  }, [id]);

  if (!skill) {
    return <Text>Carregando...</Text>;
  }

  const goToEdit = (id: string) => {
    navigation.navigate("skillEdit", { id });
  };

  return (
    <VStack flex={1}>
      <VStack px="$5" bg="$blueNeki600" pt="$12">
      <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon as={ArrowLeft} color="$white" size="xl" />
        </TouchableOpacity>

        
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {skill.title}
          </Heading>

          <TouchableOpacity onPress={() => goToEdit(skill.id.toString())}>
            <Icon as={Edit} color="$white" size="lg" />
          </TouchableOpacity>
        </HStack>
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack py="$8" px="$5">
          <Image
            source={{ uri: skill.image }}
            alt={`Imagem de ${skill.title}`}
            mb="$3"
            resizeMode="cover"
            rounded="$lg"
            w="$full"
            h="$40"
          />

<HStack alignItems="center" justifyContent="flex-start" mt="$2" mb="$4" flexWrap="wrap" >
  {skill.category &&
    skill.category.map((category, index) => (
      <Box
        key={index}
        bg="$blueNeki600"
        rounded="$md"
        py="$1.5"
        px="$2.5"
        mr="$2"
        mb="$2"
      >
        <Text fontSize="$xs" color="$white">
          {category.name}
        </Text>
      </Box>
    ))}
</HStack>

          <MarkdownRenderer content={skill.description} />

          <Button mt="$8" title="Realizar teste" />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
