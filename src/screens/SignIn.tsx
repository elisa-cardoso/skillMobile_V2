import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
  HStack,
  Pressable,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "@assets/logo-branco.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useAuth } from "../context/AuthContext";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { signIn } from "@services/UserServices";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginSchema = z.object({
  login: z
    .string()
    .email("E-mail inválido.")
    .min(1, "E-mail é obrigatório.")
    .default(""),
  password: z.string().min(1, "Senha é obrigatória.").default(""),
});

type FormData = z.infer<typeof loginSchema>;

export function SignIn() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const navigationHome = useNavigation<AppNavigatorRoutesProps>();
  const { auth } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const loadStoredData = async () => {
      const storedLogin = await AsyncStorage.getItem("login");
      const storedPassword = await AsyncStorage.getItem("password");
      const rememberMe = await AsyncStorage.getItem("rememberMe");

      if (rememberMe === "true") {
        setValue("login", storedLogin || "");
        setValue("password", storedPassword || "");
      }
    };

    loadStoredData();
  }, []);

  const handleNewAccount = () => {
    navigation.navigate("signUp");
  };

  const togglePasswordVisible = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSignIn = async (data: FormData) => {
    try {
      const response = await signIn(data.login, data.password);
      if (response) {
        auth(response.token, response.login);

        if (rememberMe) {
          await AsyncStorage.setItem("login", data.login);
          await AsyncStorage.setItem("password", data.password);
          await AsyncStorage.setItem("rememberMe", "true");
        } else {
          await AsyncStorage.removeItem("login");
          await AsyncStorage.removeItem("password");
          await AsyncStorage.removeItem("rememberMe");
        }

        Toast.show({
          type: "success",
          position: "top",
          text1: "Login realizado com sucesso!",
          text2: "Você foi autenticado com sucesso.",
        });

        navigationHome.reset({
          index: 0,
          routes: [{ name: "home" }],
        });
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Erro ao realizar login",
          text2: "Por favor, confirme sua senha e tente novamente.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Erro ao fazer login",
        text2: "Algo deu errado, tente novamente.",
      });
    }
  };

  const handleRememberMeChange = (value: boolean) => {
    setRememberMe(value);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#186b67", "#121214"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.35 }}
        style={{ flex: 1 }}
      >
        <VStack flex={1}>
          <VStack flex={1} px="$10" pb="$16">
            <Center my="$24">
              <Image
                source={Logo}
                alt="Logo"
                style={{ height: 90, width: 78 }}
              />
              <Text color="$gray100" fontSize="$sm">
                Cada desafio é uma oportunidade.
              </Text>
            </Center>

            <Center gap="$4">
              <Heading color="$gray100">Acessar biblioteca</Heading>

              <Controller
                control={control}
                name="login"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.login && (
                <Text color="$red500" fontSize="$sm">
                  {errors.login.message}
                </Text>
              )}

              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <View
                    style={{
                      alignItems: "center",
                      position: "relative",
                      flex: 1,
                    }}
                  >
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Senha"
                      secureTextEntry={!isPasswordVisible}
                      pr={10}
                      maxLength={20}
                    />
                    <Pressable
                      onPress={togglePasswordVisible}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: [{ translateY: -12 }],
                      }}
                    >
                      <Ionicons
                        name={isPasswordVisible ? "eye-off" : "eye"}
                        size={20}
                        color="#7C7C8A"
                      />
                    </Pressable>
                  </View>
                )}
              />
              {errors.password && (
                <Text color="$red500" fontSize="$sm">
                  {errors.password.message}
                </Text>
              )}
            </Center>

            <HStack mt="$4" mb="$5">
              <Pressable onPress={() => handleRememberMeChange(!rememberMe)}>
                <HStack>
                  <Ionicons
                    name={rememberMe ? "checkbox" : "square-outline"}
                    size={24}
                    color="#C4C4CC"
                  />
                  <Text color="$gray100" ml="$2" mt="$0.5">
                    Lembrar Senha
                  </Text>
                </HStack>
              </Pressable>
            </HStack>

            <Button
              title="Entrar"
              onPress={handleSubmit(handleSignIn)}
              disabled={isSubmitting}
            />

            <Center flex={1} justifyContent="flex-end" marginTop="$4">
              <Text color="$gray100" fontSize="$sm" mb="$4" fontFamily="$body">
                Ainda não tem acesso?
              </Text>
              <Button
                title="Criar conta"
                variant="outline"
                onPress={handleNewAccount}
              />
            </Center>
          </VStack>
        </VStack>
      </LinearGradient>
    </ScrollView>
  );
}
