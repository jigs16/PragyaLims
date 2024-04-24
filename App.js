/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  LogBox,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AuthNavigator from './app/navigation/AuthNavigator';
import SpalshNavigator from './app/navigation/SpalshNavigator';
import {BottomTabNavigator} from './app/navigation/BottomTabNavigator';
import {BaseColor} from './app/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from './app/network/networkUtils';

const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar
          animated={true}
          backgroundColor={BaseColor.backgroundGradient1}
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
      </GestureHandlerRootView>
    </>
  );
};

export default App;
