import { useEffect, useState } from "react";
import { FlatList, Alert } from "react-native";
import { VStack, Center, Heading, Text } from "@gluestack-ui/themed";
import Toast from "react-native-toast-message";
import { UserSkill } from "../@types/userSkill";
import { getAssociation, deleteAssociation, toggleFavorite } from "@services/UserSkillServices";
import { useNavigation } from "@react-navigation/native";
import { LibraryStackRoutes } from "@routes/stack.routes";
import { LibraryPostCard } from "@components/LibraryPostCard";
import { StackNavigationProp } from "@react-navigation/stack";
import { MenuProvider } from "react-native-popup-menu";
import { Button } from "@components/Button";

export function Library() {
  const [associations, setAssociations] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<
    StackNavigationProp<LibraryStackRoutes, "librarySkillDetails", "association">
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
      Toast.show({
        type: "error",
        position: "top", 
        text1: "Erro ao carregar associações.",
        text2: "Não foi possível carregar as associações. Tente novamente.",
      });
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
              setAssociations((prev) => prev.filter((assoc) => assoc.id !== id));
              Toast.show({
                type: "success",
                position: "top",
                text1: "Associação excluída.",
                text2: "A associação foi excluída com sucesso!",
              });
            } catch {
              Toast.show({
                type: "error",
                position: "top",
                text1: "Erro ao excluir associação.",
                text2: "Não foi possível excluir a associação. Tente novamente.",
              });
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
        .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0))
      );
      Toast.show({
        type: "success",
        position: "top",
        text1: "Status alterado com sucesso!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Erro ao alterar status.",
        text2: "Não foi possível atualizar o status de favorito.",
      });
    }
  };

  const goToDetails = (skillId: string) => {
    navigation.navigate("librarySkillDetails", { id: skillId });
  };

  const goToCreateAssociation = () => {
    navigation.navigate("association");
  };

  return (
    <VStack flex={1}>
      <VStack px="$5" bg="$blueNeki600" pt="$12" mb="$8">
        <Center pt="$4" pb="$6">
          <Heading color="$white">Minha biblioteca</Heading>
        </Center>
      </VStack>
      <VStack mx="$5" mb="$8">
        <Text color="$white" textAlign="center" my="$4">Gerencie e descubra novas habilidade!</Text>
      <Button title="Criar Associação"  onPress={goToCreateAssociation} />
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
      <Toast />
    </VStack>
  );
}
