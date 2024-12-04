import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
  FlatList,
  Text,
} from "react-native";
import {
  HStack,
  Image,
  Text as GlueText,
  Heading,
  VStack,
} from "@gluestack-ui/themed";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Swipeable } from "react-native-gesture-handler";
import Animated, {
  SlideInRight,
  SlideOutRight,
  Layout,
  Easing,
} from "react-native-reanimated";
import { UserSkill } from "../@types/userSkill";
import { Trash2 } from "lucide-react-native";
import { updateSkillDifficulty } from "@services/UserSkillServices";
import Toast from "react-native-toast-message";

interface LibraryItemProps {
  skill: UserSkill;
  onToggleFavorite: (id: number) => void;
  onDelete: (id: number) => void;
  onPress: (skillId: string) => void;
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

export const LibraryPostCard: React.FC<LibraryItemProps> = ({
  skill,
  onToggleFavorite,
  onDelete,
  onPress,
}) => {
  const swipeableRef = useRef<Swipeable>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    skill.difficultyRating
  );

  const handleToggleFavorite = () => {
    onToggleFavorite(skill.id);
    swipeableRef.current?.close();
  };

  const handleDelete = () => {
    onDelete(skill.id);
    swipeableRef.current?.close();
  };

  const handleSelectDifficulty = async (difficultyRating: string) => {
    try {
      setSelectedDifficulty(difficultyRating);

      console.log("Atualizando dificuldade:", {
        skillId: skill.skillId,
        difficultyRating,
      });

      const response = await updateSkillDifficulty(
        skill.skillId,
        difficultyRating
      );
      setModalVisible(false);

      Toast.show({
        type: "success",
        position: "top",
        text1: `Dificuldade Atualizada: ${difficultyRating}!`,
        text2: `Você alterou a dificuldade da habilidade ${skill.skillName}`,
      });
    } catch (error) {
      console.error("Erro ao atualizar a dificuldade:", error);

      
      Toast.show({
        type: "error",
        position: "top",
        text1: "Erro ao atualizar a dificuldade",
        text2: "Tente novamente mais tarde.",
      });
    }
  };

  const renderDifficultyIcon = () => {
    const selectedOption = DIFFICULTY_OPTIONS.find(
      (option) => option.value === selectedDifficulty
    );
    return selectedOption ? selectedOption.icon : "help-outline";
  };

  const renderStars = (level: number) => {
    const fullStars = Math.floor(level);
    const emptyStars = 5 - fullStars;

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <Icon key={index} name="star" size={16} color="yellow" />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <Icon
            key={index + fullStars}
            name="star-border"
            size={16}
            color="yellow"
          />
        ))}
      </>
    );
  };

  const renderLeftActions = () => (
    <View style={styles.swipeableRemove}>
      <Trash2 size={24} color="white" />
    </View>
  );

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.swipeableFavorite}
      onPress={handleToggleFavorite}
    >
      <Icon
        name={skill.favorite ? "favorite" : "favorite-border"}
        size={24}
        color="white"
      />
    </TouchableOpacity>
  );

  return (
    <Animated.View
      entering={SlideInRight.duration(400).easing(Easing.ease)}
      exiting={SlideOutRight.duration(400).easing(Easing.ease)}
      layout={Layout.springify().damping(20).mass(1).stiffness(90)}
    >
      <Swipeable
        ref={swipeableRef}
        overshootLeft={false}
        overshootRight={false}
        containerStyle={styles.swipeableContainer}
        leftThreshold={10}
        rightThreshold={10}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        onSwipeableOpen={(direction) => {
          if (direction === "left") {
            handleDelete();
          } else if (direction === "right") {
            handleToggleFavorite();
          }
        }}
      >
        <TouchableOpacity onPress={() => onPress(skill.skillId.toString())}>
          <HStack
            borderWidth="$1"
            borderColor={skill.favorite ? "$green500" : "$gray400"}
            alignItems="center"
            p="$2"
            pr="$4"
            rounded="$md"
            mb="$3"
            backgroundColor="$gray900"
          >
            <Image
              source={{ uri: skill.image }}
              alt={`Imagem de ${skill.skillName}`}
              w="$16"
              h="$20"
              rounded="$md"
              mr="$4"
              ml="$1"
              resizeMode="cover"
            />
            <VStack flex={1}>
              <Heading fontSize="$lg" color="$white" fontFamily="$heading">
                {skill.skillName}
              </Heading>
              <HStack justifyContent="flex-start">
                {renderStars(skill.level)}
              </HStack>
              <GlueText
                fontSize="$sm"
                color="$gray200"
                mt="$1"
                mb="$2"
                mr="$2"
                numberOfLines={2}
              >
                {skill.description}
              </GlueText>
            </VStack>

            <HStack mx="$2">
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Icon
                  name={renderDifficultyIcon()}
                  size={24}
                  color={
                    DIFFICULTY_OPTIONS.find(
                      (option) => option.value === selectedDifficulty
                    )?.color || "white"
                  }
                />
              </TouchableOpacity>
            </HStack>
          </HStack>
        </TouchableOpacity>
      </Swipeable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <FlatList
              data={DIFFICULTY_OPTIONS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelectDifficulty(item.value)}
                >
                  <Icon name={item.icon} size={24} color={item.color} />
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    marginBottom: 10,
    borderRadius: 5,
  },
  swipeableRemove: {
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "90%",
    borderRadius: 5,
  },
  swipeableFavorite: {
    backgroundColor: "#36a49f",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "90%",
    borderRadius: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#323238",
    borderRadius: 8,
    padding: 20,
    width: 200,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#7C7C8A",
  },
  optionText: {
    color: "white",
    marginLeft: 10,
  },
});
