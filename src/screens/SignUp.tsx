import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import Logo from "@assets/logo-branco.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export function SignUp() {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

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
        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Image source={Logo} alt="Logo" style={{ height: 90, width: 78 }} />
            <Text color="$gray100" fontSize="$sm">
              Cada desafio é uma oportunidade.
            </Text>
          </Center>
          <Center mt={-26} flex={1} gap="$4">
            <Heading color="$gray100">Crie sua conta</Heading>
            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input placeholder="Senha" secureTextEntry />
            <Input placeholder="Confirmar Senha" />
            <Button title="Criar e acessar" />
            <Text
              color="$gray100"
              fontSize="$xs"
              style={{ textAlign: "center" }}
            >
              Continuando você concorda com os{" "}
              <Text
                fontSize="$xs"
                style={{ textDecorationLine: "underline", color: "$blue500" }}
              >
                termos de serviço
              </Text>{" "}
              e{" "}
              <Text
                fontSize="$xs"
                style={{ textDecorationLine: "underline", color: "$blue500" }}
              >
                políticas de privacidade
              </Text>
              .
            </Text>
          </Center>
          <Button
            title="Voltar para o login"
            variant="outline"
            mt="$12"
            onPress={handleGoBack}
          />
        </VStack>
      </LinearGradient>
    </ScrollView>
  );
}
