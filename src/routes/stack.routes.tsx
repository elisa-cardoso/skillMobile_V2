import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SkillDetails } from "@screens/SkillDetails";
import { Home } from "@screens/Home";
import { SkillEdit } from "@screens/SkillEdit";
import { Library } from "@screens/Library";

export type HomeStackRoutes = {
  galery: undefined;
  homeSkillDetails: { id: string };
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
      <HomeStack.Screen
        name="galery"
        component={Home}
        options={{
          animation: "slide_from_right",
        }}
      />
      <HomeStack.Screen
        name="homeSkillDetails"
        component={SkillDetails}
        options={{
          animation: "slide_from_right", 
        }}
      />
      <HomeStack.Screen
        name="skillEdit"
        component={SkillEdit}
        options={{
          animation: "slide_from_right", 
        }}
      />
    </HomeStack.Navigator>
  );
}

export function LibraryStackNavigator() {
  return (
    <LibraryStack.Navigator screenOptions={{ headerShown: false }}>
      <LibraryStack.Screen
        name="myLibrary"
        component={Library}
        options={{
          animation: "fade", 
        }}
      />
      <LibraryStack.Screen
        name="librarySkillDetails"
        component={SkillDetails}
        options={{
          animation: "slide_from_right", 
        }}
      />
      <LibraryStack.Screen
        name="skillEdit"
        component={SkillEdit}
        options={{
          animation: "fade", 
        }}
      />
    </LibraryStack.Navigator>
  );
}
