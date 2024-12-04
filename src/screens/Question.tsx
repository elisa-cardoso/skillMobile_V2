import React, { useEffect, useState } from "react";
import { Alert, BackHandler, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, interpolate, Easing, runOnJS } from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { Bar } from 'react-native-progress';
import { QuestionCheckbox } from "@components/QuestionCheckbox";
import { getQuestionsBySkillId, getUserSkillLevel, getValidAnswer } from "@services/QuestionServices";
import { Question } from "../@types/question";
import { Center, VStack, Text } from "@gluestack-ui/themed";
import { Button } from "@components/Button";
import Toast from "react-native-toast-message";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

const CARD_INCLINATION = 10;
const CARD_SKIP_AREA = -200;

export function Questions() {
  const route = useRoute();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { skillId } = route.params as { skillId: string };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [points, setPoints] = useState(0);

  const shake = useSharedValue(0);
  const cardPosition = useSharedValue(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const data = await getQuestionsBySkillId(Number(skillId));
        setQuestions(data);
      } catch {
        Alert.alert("Erro", "Erro ao carregar as questões.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [skillId]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  };

  const validateAnswer = async () => {
    if (!selectedAnswer) {
      Alert.alert("Erro", "Selecione uma resposta.");
      return;
    }

    const question = questions[currentQuestionIndex];
    const response = await getValidAnswer(question.id, selectedAnswer);

    if (response?.correct) {
      setPoints((prev) => prev + 1);
      handleNextQuestion();
    } else {
      triggerShakeAnimation(() => handleNextQuestion());
    }
  };

  const finishQuiz = async () => {
    try {
      const { score, level } = await getUserSkillLevel(Number(skillId));
      Toast.show({
        type: "success",
        position: "top",
        text1: "Parabéns! Você finalizou o quiz!",
        text2: "Confira seu nível de conhecimento.",
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "library" }],
      });
    } catch {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Erro ao finalizar quiz.",
        text2: "Tente novamente mais tarde.",
      });
    }
  };

  const triggerShakeAnimation = async (onComplete?: () => void) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    shake.value = withSequence(
      withTiming(3, { duration: 400, easing: Easing.bounce }),
      withTiming(0, {}, () => {
        if (onComplete) {
          runOnJS(onComplete)();
        }
      })
    );
  };

  const shakeStyleAnimated = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shake.value, [0, 1, 2, 3], [0, -15, 15, 0]),
      },
    ],
  }));

  const onPan = Gesture.Pan()
    .onUpdate((event) => {
      cardPosition.value = event.translationX;
    })
    .onEnd(() => {
      if (cardPosition.value < CARD_SKIP_AREA) {
        runOnJS(handleNextQuestion)();
      }
      cardPosition.value = withTiming(0);
    });

  const dragStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: cardPosition.value },
      { rotateZ: `${cardPosition.value / CARD_INCLINATION}deg` },
    ],
  }));

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert("Sair", "Deseja realmente sair?", [
        { text: "Não", style: "cancel" },
        { text: "Sim", onPress: () => navigation.goBack(), style: "destructive" },
      ]);
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  if (loading) {
    return <Text style={styles.loadingText}>Carregando...</Text>;
  }

  return (
    <Center bg="$gray900" flex={1} alignContent="center" mx="$8">
      <Bar
        progress={currentQuestionIndex / questions.length}
        width={260}
        height={8}
        color="#36a49f"
        borderRadius={5}
        style={{ marginBottom: 20, marginTop: "20%" }}
      />

      <GestureDetector gesture={onPan}>
        <Animated.View style={[shakeStyleAnimated, dragStyles, styles.card]}>
          <Text color="$white" fontSize="$lg" mt="$2" mb="$5">
            {questions[currentQuestionIndex].questionText}
          </Text>
          <VStack gap="$4">
            <QuestionCheckbox
              value="A"
              label={questions[currentQuestionIndex].optionA}
              checked={selectedAnswer === "A"}
              onChange={(checked) => setSelectedAnswer(checked ? "A" : null)}
            />
            <QuestionCheckbox
              value="B"
              label={questions[currentQuestionIndex].optionB}
              checked={selectedAnswer === "B"}
              onChange={(checked) => setSelectedAnswer(checked ? "B" : null)}
            />
            <QuestionCheckbox
              value="C"
              label={questions[currentQuestionIndex].optionC}
              checked={selectedAnswer === "C"}
              onChange={(checked) => setSelectedAnswer(checked ? "C" : null)}
            />
            <QuestionCheckbox
              value="D"
              label={questions[currentQuestionIndex].optionD}
              checked={selectedAnswer === "D"}
              onChange={(checked) => setSelectedAnswer(checked ? "D" : null)}
            />
            <Button mt="$5" title="Confirmar Resposta" onPress={validateAnswer} />
          </VStack>
        </Animated.View>
      </GestureDetector>
    </Center>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
  card: {
    backgroundColor: "#29292E",
    borderRadius: 8,
    padding: 20,
    marginVertical: 20,
  },
});
