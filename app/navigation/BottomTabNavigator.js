import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, useColorScheme } from "react-native";
import { BaseColor, Images } from "../config";
import DashboardNavigator from "./DashboardNavigator";
import ProfileNavigator from "./ProfileNavigator";
import ControlCenterNavigator from "./ControlCenterNavigator";
import MISNavigator from "./MISNavigator";
import { verticalScale } from "../config/scaling";

const Tab = createBottomTabNavigator();

export function BottomTabNavigator() {
  const isDarkMode = useColorScheme();
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        tabBarActiveTintColor: BaseColor.blackColor,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          paddingTop: 14,
          backgroundColor: BaseColor.whiteColor,
          height: verticalScale(120),
        },
        tabBarLabelStyle: {
          fontSize: 14, // Adjust the font size as needed
          marginTop: 10,
          fontWeight: "500",
          marginBottom: 8,
          color: "#000",
        },
        tabBarActiveLabelStyle: {
          fontWeight: "400",
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardNavigator}
        initialParams={{ screenType: 1 }}
        options={{
          tabBarLabel: "Dashboard",
          unmountOnBlur: true,
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#18a5942e" : BaseColor.whiteColor,
                width: 50,
                height: 28,
                borderRadius: 20,
                alignItems: "center",
              }}
            >
              <Image
                source={focused ? Images.a_db : Images.db}
                tintColor={
                  focused ? BaseColor.buttonGradient1 : BaseColor.blackColor
                }
                style={{
                  resizeMode: "contain",
                  width: focused ? 16 : 22,
                  marginTop: -18,
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ControlCenter"
        component={ControlCenterNavigator}
        initialParams={{ screenType: 2 }}
        options={{
          tabBarLabel: "Control Center",
          unmountOnBlur: true,
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#18a5942e" : BaseColor.whiteColor,
                width: 50,
                height: 28,
                borderRadius: 20,
                alignItems: "center",
              }}
            >
              <Image
                source={focused ? Images.a_cc : Images.cc}
                tintColor={
                  focused ? BaseColor.buttonGradient1 : BaseColor.blackColor
                }
                style={{
                  resizeMode: "contain",
                  width: focused ? 16 : 22,
                  marginTop: -18,
                }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MIS"
        component={MISNavigator}
        initialParams={{ screenType: 3 }}
        options={{
          unmountOnBlur: true,
          tabBarLabel: "MIS",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#18a5942e" : BaseColor.whiteColor,
                width: 50,
                height: 28,
                borderRadius: 20,
                alignItems: "center",
              }}
            >
              <Image
                source={focused ? Images.a_ms : Images.ms}
                tintColor={
                  focused ? BaseColor.buttonGradient1 : BaseColor.blackColor
                }
                style={{
                  resizeMode: "contain",
                  width: focused ? 16 : 22,
                  marginTop: -18,
                }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        initialParams={{ screenType: 4 }}
        options={{
          tabBarLabel: "Dashboard",
          unmountOnBlur: true,
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#18a5942e" : BaseColor.whiteColor,
                width: 50,
                height: 28,
                borderRadius: 20,
                alignItems: "center",
              }}
            >
              <Image
                source={focused ? Images.a_UserBottom : Images.UserBottom}
                tintColor={
                  focused ? BaseColor.buttonGradient1 : BaseColor.blackColor
                }
                style={{
                  resizeMode: "contain",
                  width: focused ? 16 : 22,
                  marginTop: -18,
                }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
