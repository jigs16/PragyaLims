import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { BaseColor } from "../config";
import EditProfile from "../screens/EditProfile";
import MyAccount from "../screens/MyAccount";
import Profile from "../screens/Profile";
import Operation from "../screens/Operation";
import ReportPrinting from "../screens/ReportPrinting";
import ReportDispatch from "../screens/ReportDispatch";
import MaterialDispatch from "../screens/MaterialDispatch";

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
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyAccount"
          component={MyAccount}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Operation"
          component={Operation}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ReportPrinting"
          component={ReportPrinting}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="ReportDispatch"
          component={ReportDispatch}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="MaterialDispatch"
          component={MaterialDispatch}
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
