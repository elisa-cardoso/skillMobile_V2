import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Textarea,
  TextareaInput,
  Center,
} from "@gluestack-ui/themed";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSkillById, updateSkill } from "@services/SkillServices";
import { Skills } from "../@types/skills";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { getCategories } from "@services/CategoryServices";
import { CategoryCheckboxGroup } from "@components/Checkbox";

const skillValidationSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres."),
  category: z
    .array(z.string())
    .min(1, "A skill deve ter pelo menos uma categoria."),
  image: z
    .string()
    .url("Insira uma URL válida para a imagem.")
    .optional(),
});

type SkillFormData = z.infer<typeof skillValidationSchema>;

export function SkillEdit() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };

  const [skill, setSkill] = useState<Skills | null>(null);
  const [categories, setCategories] = useState<{ name: string; id: number }[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Erro ao carregar as categorias:", error);
      }
    };

    fetchCategories();
  }, []);

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillValidationSchema),
  });

  useEffect(() => {
    if (skill) {
      reset({
        title: skill.title,
        description: skill.description,
        category: skill.category.map((cat) => cat.name),
        image: skill.image || "",
      });
    }
  }, [skill, reset]);

  const onSubmit = async (data: SkillFormData) => {
    try {
      const updatedData = {
        id: Number(id),
        title: data.title,
        description: data.description,
        category: data.category.map((catName) => {
          const category = categories.find((cat) => cat.name === catName);
          return category ? category.id : 0;
        }),
        image: data.image || "",
      };

      await updateSkill(Number(id), updatedData);
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar a skill:", error);
    }
  };

  return (
    <VStack flex={1}>
      <VStack px="$5" bg="$blueNeki600" pt="$12">
        <HStack
          alignItems="center"
          mt="$4"
          mb="$8"
          justifyContent="space-between"
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon as={ArrowLeft} color="$white" size="xl" />
          </TouchableOpacity>

          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            position="absolute"
            left="50%"
            transform={[{ translateX: -50 }]}
          >
            Editar Habilidade
          </Heading>
        </HStack>
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack py="$8" px="$5">
          <Controller
            name="title"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <VStack mb="$8">
                <Text fontSize="$md" mb="$4" color="$white">
                  Título
                </Text>
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Insira o título..."
                />
                {errors.title && (
                  <Text fontSize="$sm" mt="$2" color="$red500">
                    {errors.title.message}
                  </Text>
                )}
              </VStack>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <VStack mb="$8">
                <Text fontSize="$md" mb="$4" color="$white">
                  Descrição
                </Text>
                <Textarea
                  bg="$gray700"
                  h="$56"
                  px="$4"
                  borderWidth="$1"
                  borderColor="$gray400"
                  borderRadius="$lg"
                  $focus={{ borderWidth: 1, borderColor: "$green500" }}
                >
                  <TextareaInput
                    color="$white"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Insira a descrição..."
                  />
                </Textarea>
                {errors.description && (
                  <Text fontSize="$sm" mt="$2" color="$red500">
                    {errors.description.message}
                  </Text>
                )}
              </VStack>
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <VStack mb="$8">
                <Text fontSize="$md" mb="$4" color="$white">
                  Categorias
                </Text>
                <CategoryCheckboxGroup
                  categories={categories}
                  value={field.value}
                  onChange={field.onChange}
                />
                {errors.category && (
                  <Text fontSize="$sm" mt="$2" color="$red500">
                    {errors.category.message}
                  </Text>
                )}
              </VStack>
            )}
          />

          <Controller
            name="image"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <VStack mb="$4">
                <Text fontSize="$md" mb="$4" color="$white">
                  URL da Imagem
                </Text>
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Insira a URL da imagem..."
                />
                {errors.image && (
                  <Text fontSize="$sm" mt="$2" color="$red500">
                    {errors.image.message}
                  </Text>
                )}
              </VStack>
            )}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            mt="$8"
            title="Salvar Alterações"
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
