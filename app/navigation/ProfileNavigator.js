import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { BaseColor } from "../config";
import Profile from "../screens/Profile";

const Stack = createNativeStackNavigator();
const ProfileNavigator = () => {
  return (
    <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
          }}
        />

       
      </Stack.Navigator>
    </View>
  );
};
//MaterialDispatch
export default ProfileNavigator;
