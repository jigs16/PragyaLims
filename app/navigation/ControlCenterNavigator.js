import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {BaseColor} from '../config';
import ControlCenter from '../screens/ControlCenter';

const Stack = createNativeStackNavigator();
const ControlCenterNavigator = () => {
  console.log('Welcome Deshboard');
  return (
    <View style={{flex: 1, backgroundColor: BaseColor.whiteColor}}>
      <Stack.Navigator
        initialRouteName="ControlCenter"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="ControlCenter"
          component={ControlCenter}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default ControlCenterNavigator;
