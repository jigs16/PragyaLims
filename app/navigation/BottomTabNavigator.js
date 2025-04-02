import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, useColorScheme } from "react-native";
import { BaseColor, Images } from "../config";
import DashboardNavigator from "./DashboardNavigator";
import ProfileNavigator from "./ProfileNavigator";
import ControlCenterNavigator from "./ControlCenterNavigator";
import MISNavigator from "./MISNavigator";
import { verticalScale } from "../config/scaling";
import ChatNavigator from "./ChatNavigator";
import LogNavigator from "./LogNavigator";

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
          fontSize: 13, // Adjust the font size as needed
          marginTop: 10,
          fontWeight: "500",
          marginBottom: 8,
          color: BaseColor.DarkIconColor,
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
          tabBarLabel: "Home",
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
                  focused ? BaseColor.buttonGradient1 : BaseColor.DarkIconColor
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
          tabBarLabel: "Process",
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
                  focused ? BaseColor.buttonGradient1 : BaseColor.DarkIconColor
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
        name="ChatNavigator"
        component={ChatNavigator}
        initialParams={{ screenType: 4 }}
        options={{
          tabBarLabel: "Chat",
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
                source={focused ? Images.a_chat : Images.chat}
                tintColor={
                  focused ? BaseColor.buttonGradient1 : BaseColor.DarkIconColor
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
        name="LogNavigator"
        component={LogNavigator}
        initialParams={{ screenType: 4 }}
        options={{
          tabBarLabel: "Log",
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
                source={focused ? Images.a_Activitylog : Images.activityLog}
                tintColor={
                  focused ? BaseColor.buttonGradient1 : BaseColor.DarkIconColor
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
    </Tab.Navigator>
  );
}
