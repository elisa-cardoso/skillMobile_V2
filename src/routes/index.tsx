import { NavigationContainer, DefaultTheme, useNavigation } from '@react-navigation/native'
import { gluestackUIConfig } from '../../config/gluestack-ui.config'
import { Box } from '@gluestack-ui/themed'
import { AppRoutes } from './app.routes'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthRoutes } from './auth.routes'
import { Loading } from '@components/Loading'
import { useAuth } from '../context/AuthContext'

export function Routes() {
  const { isAuthenticated, auth } = useAuth();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        auth(token); 
      }
    };

    checkAuthStatus();
  }, [auth]);

  const theme = DefaultTheme
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return (
   <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme} >
        {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}