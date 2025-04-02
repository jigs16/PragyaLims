import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { BaseColor } from "../config";
import ControlCenter from "../screens/ControlCenter";
import InwardApproval from "../screens/InwardApproval";
import TestingApproval from "../screens/TestingApproval";
import Testing from "../screens/Testing";
import InwardStatistics from "../screens/InwardStatistics";
import InwardContactPersons from "../screens/InwardContactPersons";
import WorkProcess from "../screens/WorkProcess";
import ReportPrinting from "../screens/ReportPrinting";
import ReportDispatch from "../screens/ReportDispatch";
import MaterialDispatch from "../screens/MaterialDispatch";
import MachiningOutward from "../screens/MachiningOutward";
import MachiningOutwardDetails from "../screens/MachiningOutwardDetails";
import TestingList from "../screens/TestingList";
import UploadScancopy from "../screens/UploadScancopy";
import TCTestAllocation from "../screens/TCTestAllocation";

const Stack = createNativeStackNavigator();
const ControlCenterNavigator = () => {
  console.log("Welcome Deshboard");
  return (
    <View style={{ flex: 1, backgroundColor: BaseColor.whiteColor }}>
      <Stack.Navigator
        initialRouteName="WorkProcess"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="WorkProcess"
          component={WorkProcess}
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

        <Stack.Screen
          name="ControlCenter"
          component={ControlCenter}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="InwardApproval"
          component={InwardApproval}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="TestingApproval"
          component={TestingApproval}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Testing"
          component={Testing}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="InwardStatistics"
          component={InwardStatistics}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="InwardContactPersons"
          component={InwardContactPersons}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="MachiningOutward"
          component={MachiningOutward}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="MachiningOutwardDetails"
          component={MachiningOutwardDetails}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="TestingList"
          component={TestingList}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="UploadScancopy"
          component={UploadScancopy}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="TCTestAllocation"
          component={TCTestAllocation}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};
//
export default ControlCenterNavigator;
