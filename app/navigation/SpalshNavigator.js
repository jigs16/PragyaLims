import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import Splash from '../screens/Splash';

const Stack = createNativeStackNavigator();

const SpalshNavigator = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default SpalshNavigator;
