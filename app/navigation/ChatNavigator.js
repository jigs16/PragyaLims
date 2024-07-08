import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { BaseColor } from "../config";
import Profile from "../screens/Profile";
import Chat from "../screens/Chat";

const Stack = createNativeStackNavigator();
const ChatNavigator = () => {
  return (
    <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
      <Stack.Navigator initialRouteName="Chat">
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};
//MaterialDispatch
export default ChatNavigator;
