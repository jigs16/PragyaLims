/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import { AppState, Keyboard, LogBox, useColorScheme } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import SpalshNavigator from "./app/navigation/SpalshNavigator";
import { BottomTabNavigator } from "./app/navigation/BottomTabNavigator";
import { navigationRef } from "./app/network/networkUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";
import * as signalR from "@microsoft/signalr";
import { ChatProvider, useChatContext } from "./app/screens/Chat/ChatProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "./app/network/api";

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

  const { updateChat } = useChatContext();

  useEffect(() => {
    const handleKeyDownForm = (event) => {
      // Handle the key down event
      console.log("Key pressed:", event);
    };

    // Add event listener
    const keyboardListener = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyDownForm
    );

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(Api.navigation.signalRBaseUrl) // Replace with your actual SignalR URL
      .build();

    // Start the connection
    connection
      .start()
      .then(() => {
        console.log("SignalR connection started.");
      })
      .catch((error) => {
        console.error("Error starting SignalR connection:", error);
      });

    // Subscribe to events from the server
    connection.on("GetMessage", (message) => {
      updateChat(message);

      // Update your React state or perform any necessary action /;
      console.log("Get New Message", message);
    });

    connection.on("ChatDeleteMessage", (message) => {
      updateChat("", message);

      // Update your React state or perform any necessary action /;
      console.log("ChatDeleteMessage", message);
    });

    connection.on("GetUnReadMessageCount", (messageUnread) => {
      AsyncStorage.setItem("userUnReadMessageCount", messageUnread);

      // Update your React state or perform any necessary action /; 
      console.log("Signalr Mesg", messageUnread);
    });

    connection.onclose(() => {
      console.log("SignalR connection closed.");
    });

    // Clean up the event listener when component unmounts
    return () => {
      if (connection) {
        connection.stop();
      }
      keyboardListener.remove();
    };
  }, []);

  return (
    <>
      {/* <GestureHandlerRootView style={{flex: 1}}> */}
      <SafeAreaView style={backgroundStyle}>
        {/* <Loader loading={isLoading} useCircularProgress={false} /> */}
        {/* <StatusBar
          animated={true}
          backgroundColor={backgroundStyle.backgroundColor}
        /> */}
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
const WrappedApp = () => (
  <ChatProvider>
    <App />
  </ChatProvider>
);

export default WrappedApp;

// export default App;
