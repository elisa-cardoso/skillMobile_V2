import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { Home } from "@screens/Home";
import { Library } from "@screens/Library";
import { SkillManagement } from "@screens/SkillManagement";
import { gluestackUIConfig } from "../../config/gluestack-ui.config";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Platform } from "react-native";
import { StackNavigator } from "./stack.routes";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "./auth.routes";

type AppRoutes = {
  home: undefined;
  library: undefined;
  skillManagement: undefined;
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { tokens } = gluestackUIConfig;
  const iconSize = tokens.space["7"];
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  if (!isAuthenticated) {
    navigation.navigate('signIn');
    return null;
  }

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: tokens.colors.gray500,
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: tokens.space['12'],
          paddingTop: tokens.space['2'],

        },
        tabBarActiveTintColor: tokens.colors.white,
        tabBarInactiveTintColor: tokens.colors.gray300,
      }}
    >
      <Screen
        name="home"
        component={StackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={iconSize} />
          ),
        }}
      />
      <Screen
        name="library"
        component={Library}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="collections-bookmark" color={color} size={iconSize} />
          ),
        }}
      />
      <Screen
        name="skillManagement"
        component={SkillManagement}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="settings" color={color} size={iconSize} />
          ),
        }}
      />
    </Navigator>
  );
}
