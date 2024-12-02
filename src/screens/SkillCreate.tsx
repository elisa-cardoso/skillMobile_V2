import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
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
import { createSkill } from "@services/SkillServices";
import { getCategories } from "@services/CategoryServices";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { CategoryCheckboxGroup } from "@components/Checkbox";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

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
    .url("Por favor, insira uma URL válida para a imagem.")
    .optional(),
});

type SkillFormData = z.infer<typeof skillValidationSchema>;

export function SkillCreate() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillValidationSchema),
    defaultValues: {
      title: "",
      description: "",
      category: [],
      image: "",
    },
  });

  const onSubmit = async (data: SkillFormData) => {
    try {
      const requestData = {
        title: data.title,
        description: data.description,
        category: data.category.map((catName) => {
          const category = categories.find((cat) => cat.name === catName);
          return category ? category.id : 0;
        }),
        image: data.image || "",
      };
  
      await createSkill(requestData);
      reset();
      navigation.navigate("home"); 
    } catch (error) {
      console.error("Erro ao criar skill:", error);
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
            Criar Habilidade
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
                  Título da Skill
                </Text>
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Digite o título"
                />
                {errors.title && (
                  <Text fontSize="$sm" color="$red500">
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
                    placeholder="Digite a descrição"
                  />
                </Textarea>
                {errors.description && (
                  <Text fontSize="$sm" color="$red500">
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
                  <Text fontSize="$sm" color="$red500">
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
                  placeholder="Insira a URL da imagem"
                />
                {errors.image && (
                  <Text fontSize="$sm" color="$red500">
                    {errors.image.message}
                  </Text>
                )}
              </VStack>
            )}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            mt="$8"
            title="Criar Skill"
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
