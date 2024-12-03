import { useEffect, useState } from "react";
import { FlatList, Alert } from "react-native";
import { VStack, Center, Heading } from "@gluestack-ui/themed";
import { UserSkill } from "../@types/userSkill";
import { getAssociation, deleteAssociation, toggleFavorite } from "@services/UserSkillServices";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LibraryStackRoutes } from "@routes/stack.routes";
import { LibraryPostCard } from "@components/LibraryPostCard";

export function Library() {
  const [associations, setAssociations] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<
    StackNavigationProp<LibraryStackRoutes, "librarySkillDetails">
  >();

  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    setLoading(true);
    try {
      const data = await getAssociation();
      setAssociations(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as associações.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja excluir esta associação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAssociation(id);
              setAssociations((prev) =>
                prev.filter((assoc) => assoc.id !== id)
              );
              Alert.alert("Sucesso", "Associação excluída com sucesso!");
            } catch {
              Alert.alert("Erro", "Não foi possível excluir a associação.");
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async (id: number) => {
    try {
      const updatedAssociation = await toggleFavorite(id);
      setAssociations((prev) =>
        prev.map((assoc) =>
          assoc.id === id
            ? { ...assoc, favorite: updatedAssociation.favorite }
            : assoc
        )
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar o status de favorito.");
    }
  };

  const goToDetails = (skillId: string) => {
    console.log({ skillId });
    navigation.navigate("librarySkillDetails", { id: skillId });
  };

  return (
    <VStack flex={1}>
      <VStack px="$5" bg="$blueNeki600" pt="$12" mb="$8">
        <Center pt="$4" pb="$6">
          <Heading color="$white">Minha biblioteca</Heading>
        </Center>
      </VStack>
      <FlatList
        data={associations}
        keyExtractor={(skill) => skill.id.toString()}
        refreshing={loading}
        onRefresh={fetchAssociations}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
        renderItem={({ item }) => (
          <LibraryPostCard
            skill={item}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            onPress={goToDetails}
          />
        )}
      />
    </VStack>
  );
}
