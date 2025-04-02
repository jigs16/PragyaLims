import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {BaseColor} from '../config';
import MIS from '../screens/MIS';
import MISDetails from '../screens/MISDetails';

const Stack = createNativeStackNavigator();
const MISNavigator = () => {
  console.log('Welcome Deshboard');
  return (
    <View style={{flex: 1, backgroundColor: BaseColor.whiteColor}}>
      <Stack.Navigator
        initialRouteName="MIS"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="MIS"
          component={MIS}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MISDetails"
          component={MISDetails}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default MISNavigator;
