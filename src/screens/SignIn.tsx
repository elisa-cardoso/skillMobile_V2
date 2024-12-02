import React, { useState } from "react";
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "@assets/logo-branco.png";
import { Input } from "@components/Input"; // Assumindo que o Input já está com forwardRef
import { Button } from "@components/Button";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useNavigation } from "@react-navigation/native";
import { signIn } from "@services/UserServices";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const navigationHome = useNavigation<AppNavigatorRoutesProps>();

  const { auth } = useAuth(); 

  // Estados locais para os campos de formulário
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados para erros
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleNewAccount = () => {
    navigation.navigate("signUp");
  };

  const handleSignIn = async () => {
    console.log("Dados de login:", { login, password });
    try {
      const response = await signIn(login, password);

      if (response && response.token) {
        auth(response.token);

        navigationHome.reset({
          index: 0,
          routes: [{ name: 'home' }],
        });
      } else {
        console.error("Token de autenticação não encontrado ou resposta inválida.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["#186b67", "#121214"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.35 }}
        style={{ flex: 1 }}
      >
        <VStack flex={1}>
          <VStack flex={1} px="$10" pb="$16">
            <Center my="$24">
              <Image source={Logo} alt="Logo" style={{ height: 90, width: 78 }} />
              <Text color="$gray100" fontSize="$sm">
                Cada desafio é uma oportunidade.
              </Text>
            </Center>

            <Center gap="$4">
              <Heading color="$gray100">Acessar biblioteca</Heading>

              <Input
                value={login}
                onChangeText={setLogin}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {loginError && (
                <Text color="$red500" fontSize="$sm">
                  {loginError}
                </Text>
              )}

              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Senha"
                secureTextEntry
              />
              {passwordError && (
                <Text color="$red500" fontSize="$sm">
                  {passwordError}
                </Text>
              )}

              <Button title="Acessar painel" onPress={handleSignIn} />
            </Center>

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
