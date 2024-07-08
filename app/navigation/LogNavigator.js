import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { BaseColor } from "../config";
import Profile from "../screens/Profile";
import Chat from "../screens/Chat";
import ActivityLog from "../screens/ActivityLog";

const Stack = createNativeStackNavigator();
const LogNavigator = () => {
  return (
    <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
      <Stack.Navigator initialRouteName="ActivityLog">
        <Stack.Screen
          name="ActivityLog"
          component={ActivityLog}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};
//MaterialDispatch
export default LogNavigator;
