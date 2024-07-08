import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { BaseColor } from "../config";
import Dashboard from "../screens/Dashboard";
import Profile from "../screens/Profile";
import ProfileNavigator from "./ProfileNavigator";
import ChartDetails from "../screens/ChartDetails";

const Stack = createNativeStackNavigator();
const DashboardNavigator = () => {
  console.log("Welcome Deshboard");
  return (
    <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ProfileNavigator"
          component={ProfileNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ChartDetails"
          component={ChartDetails}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};
// ChartDetails
export default DashboardNavigator;
