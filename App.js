/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import { AppState, LogBox, StatusBar, useColorScheme } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import SpalshNavigator from "./app/navigation/SpalshNavigator";
import { BottomTabNavigator } from "./app/navigation/BottomTabNavigator";
import { BaseColor } from "./app/config";
import { navigationRef } from "./app/network/networkUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loader } from "./app/components";

const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();
const App = () => {
  const isDarkMode = useColorScheme() === "dark";
  const backgroundStyle = {
    backgroundColor: isDarkMode === "dark" ? "#191919" : "#ffffff",
    flex: 1,
  };

  const [appState, setAppState] = useState(AppState.currentState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // App has come to the foreground
        setIsLoading(true);
        // Simulate a loading process (e.g., fetching data, re-initializing resources, etc.)
        setTimeout(() => {
          setIsLoading(false);
        }, 3000); // Adjust the timeout as needed
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <>
      {/* <GestureHandlerRootView style={{flex: 1}}> */}
      <SafeAreaView style={backgroundStyle}>
        {/* <Loader loading={isLoading} useCircularProgress={false} /> */}
        <StatusBar
          animated={true}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            <Stack.Screen
              name="SpalshNavigator"
              component={SpalshNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AuthNavigator"
              component={AuthNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="BottomTabNavigator"
              component={BottomTabNavigator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AppNavigator"
              component={AppNavigator}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
      {/* </GestureHandlerRootView> */}
    </>
  );
};

export default App;
