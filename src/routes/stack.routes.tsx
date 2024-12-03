import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SkillDetails } from "@screens/SkillDetails";
import { Home } from "@screens/Home";
import { SkillEdit } from "@screens/SkillEdit";
import { Library } from "@screens/Library";

export type HomeStackRoutes = {
  galery: undefined;
  homeSkillDetails: { id: string }
  skillEdit: { id: string };
};

export type LibraryStackRoutes = {
  myLibrary: undefined;
  librarySkillDetails: { id: string };
  skillEdit: { id: string };
};

const HomeStack = createNativeStackNavigator<HomeStackRoutes>();
const LibraryStack = createNativeStackNavigator<LibraryStackRoutes>();

export function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="galery" component={Home} />
      <HomeStack.Screen name="homeSkillDetails" component={SkillDetails} />
      <HomeStack.Screen name="skillEdit" component={SkillEdit} />
    </HomeStack.Navigator>
  );
}

export function LibraryStackNavigator() {
  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen name="myLibrary" component={Library} />
      <LibraryStack.Screen name="librarySkillDetails" component={SkillDetails} />
      <LibraryStack.Screen name="skillEdit" component={SkillEdit} />
    </LibraryStack.Navigator>
  );
}
