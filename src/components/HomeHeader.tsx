import { Heading, HStack, Text, VStack, Image, Icon } from '@gluestack-ui/themed';
import Logo from "@assets/logo-branco.png";
import { LogOut } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

export function HomeHeader() {
  const { logout: contextLogout, login } = useAuth();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const handleLogout = async () => {
    try {
      contextLogout();
      
      await AsyncStorage.removeItem('token');
      console.log('Token removido, redirecionando para login.');

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Logout realizado com sucesso!',
        text2: 'Você foi desconectado.',
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'signIn' }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);

      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Erro ao fazer logout',
        text2: 'Ocorreu um problema ao tentar desconectar. Tente novamente!',
      });
    }
  };

  return (
    <HStack bg="$blueNeki600" pt='$16' pb='$5' px='$5' alignItems='center' gap='$4'>
      <Image
        source={Logo}
        alt="Logo"
        style={{ height: 50, width: 43 }}
      />
      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">
          Bem Vindo(a)!
        </Text>
        <Heading color="$gray100" fontSize="$md">
          {login}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={handleLogout}>
        <Icon as={LogOut} color='$gray100' size='xl' />
      </TouchableOpacity>
    </HStack>
  );
}
