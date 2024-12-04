import React, { useState, useEffect } from "react";
import { View, Alert, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createUserSkillAssociation } from "@services/UserSkillServices";
import { getSkills } from "@services/SkillServices";
import {
  Center,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { Button } from "@components/Button";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";

interface Skills {
  id: number;
  title: string;
  description: string;
}

const DIFFICULTY_OPTIONS = [
  {
    label: "Dominado",
    value: "dominado",
    icon: "check-circle",
    color: "#36a49f",
  },
  {
    label: "Fácil",
    value: "fácil",
    icon: "sentiment-very-satisfied",
    color: "#34d399",
  },
  {
    label: "Médio",
    value: "médio",
    icon: "sentiment-satisfied",
    color: "#fb923c",
  },
  {
    label: "Difícil",
    value: "difícil",
    icon: "sentiment-dissatisfied",
    color: "#ef4444",
  },
];

export const UserSkillAssociation = () => {
  const navigation = useNavigation();
  const [skills, setSkills] = useState<Skills[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<string>("dominado");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getSkills();
        setSkills(response);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as habilidades.");
      }
    };

    fetchSkills();
  }, []);

  const handleSubmit = async () => {
    if (!selectedSkill) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Erro",
        text2: "Selecione uma habilidade.",
      });
      return;
    }

    try {
      const response = await createUserSkillAssociation(
        selectedSkill,
        level,
        difficulty
      );
      Toast.show({
        type: "success",
        position: "top",
        text1: "Sucesso",
        text2: "Habilidade associada com sucesso!",
      });
      console.log(response);
    } catch (error) {
      console.error("Erro ao criar a associação", error);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Erro",
        text2: "Não foi possível criar a associação.",
      });
    }
  };

  return (
    <VStack flex={1}>
      <VStack px="$5" bg="$blueNeki600" pt="$12" mb="$8">
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
            transform={[{ translateX: -75 }]}
          >
            Associar Habilidade
          </Heading>
        </HStack>
      </VStack>

      <VStack mx="$5">
        <Text mb="$5" color="$white">
          Selecione a Habilidade
        </Text>
        <View
          style={{
            height: 50,
            width: "100%",
            backgroundColor: "#323238",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <Picker
            selectedValue={selectedSkill}
            onValueChange={(itemValue: number) => setSelectedSkill(itemValue)}
            style={{
              height: 50,
              width: "100%",
              color: "white",
            }}
            dropdownIconColor="white"
          >
            <Picker.Item label="Selecione uma habilidade" value={null} />
            {skills.map((skill) => (
              <Picker.Item
                key={skill.id}
                label={skill.title}
                value={skill.id}
              />
            ))}
          </Picker>
        </View>
      </VStack>

      <VStack mx="$5" gap="$4">
        <Text mb="$3" mt="$8" color="$white">
          O quanto você domina esse conhecimento?
        </Text>

        {DIFFICULTY_OPTIONS.map(({ label, value, icon, color }) => (
          <Button
            key={value}
            title={label}
            variant={difficulty === value ? "solid" : "outline"}
            onPress={() => setDifficulty(value)}
            style={{
              borderColor: difficulty === value ? color : "gray",
            }}
          >
            <HStack alignItems="center">
              <Icon as={icon} color={difficulty === value ? "white" : color} />
              <Text color={difficulty === value ? "white" : color} ml={2}>
                {label}
              </Text>
            </HStack>
          </Button>
        ))}

        <Button mt="$16" title="Associar Habilidade" onPress={handleSubmit} />
      </VStack>

      <Toast />
    </VStack>
  );
};
