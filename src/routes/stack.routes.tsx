import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SkillDetails } from "@screens/SkillDetails";
import { Home } from "@screens/Home";
import { SkillEdit } from "@screens/SkillEdit";

export type StackRoutes = {
  galery: undefined;
  skillEdit: { id: string };
  skillDetails: { id: string };
};

const Stack = createNativeStackNavigator<StackRoutes>();

export function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="galery" component={Home} />
      <Stack.Screen name="skillDetails" component={SkillDetails} />
      <Stack.Screen name="skillEdit" component={SkillEdit} />
    </Stack.Navigator>
  );
}
