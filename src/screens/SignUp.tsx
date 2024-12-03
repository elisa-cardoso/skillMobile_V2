import { useForm, Controller } from "react-hook-form";
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
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import Toast from "react-native-toast-message";
import * as z from "zod";
import { signUp } from "@services/UserServices";
import { zodResolver } from "@hookform/resolvers/zod";

// Validação do formulário de SignUp usando Zod
const signUpForm = z
  .object({
    login: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
    password: z
      .string()
      .min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
      .regex(/[A-Z]/, {
        message: "A senha deve ter pelo menos uma letra maiúscula",
      })
      .regex(/[a-z]/, {
        message: "A senha deve ter pelo menos uma letra minúscula",
      })
      .regex(/[0-9]/, { message: "A senha deve ter pelo menos um número" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirmação de senha é obrigatória" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem. Tente novamente.",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpForm>;

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { control, handleSubmit, formState: { errors } } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
  });

  const handleSignUp = async (data: SignUpForm) => {
    try {
      const registerData = {
        login: data.login,
        password: data.password,
      };

      await signUp(registerData.login, registerData.password);

      Toast.show({
        type: "success",
        position: "top",
        text1: "Cadastro realizado com sucesso!",
        text2: "Você pode agora fazer login.",
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "signIn" }],
      });
    } catch (error) {
      console.error(error);

      Toast.show({
        type: "error",
        position: "top",
        text1: "Erro ao cadastrar",
        text2: "Tente novamente mais tarde.",
      });
    }
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
              <Heading color="$gray100">Criar uma conta</Heading>

              <Controller
                name="login"
                control={control}
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
                name="password"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Senha"
                    secureTextEntry
                  />
                )}
              />
              {errors.password && (
                <Text color="$red500" fontSize="$sm">
                  {errors.password.message}
                </Text>
              )}

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Confirmar senha"
                    secureTextEntry
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text color="$red500" fontSize="$sm">
                  {errors.confirmPassword.message}
                </Text>
              )}

              <Button
                title="Cadastrar"
                onPress={handleSubmit(handleSignUp)}
              />
            </Center>

            <Center flex={1} justifyContent="flex-end" marginTop="$4">
              <Text color="$gray100" fontSize="$sm" mb="$4" fontFamily="$body">
                Já tem uma conta?
              </Text>
              <Button
                title="Fazer login"
                variant="outline"
                onPress={() => navigation.navigate("signIn")}
              />
            </Center>
          </VStack>
        </VStack>
      </LinearGradient>
    </ScrollView>
  );
}
