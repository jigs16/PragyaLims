import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import ForgotPassword from '../screens/ForgotPassword';
import GetStarted from '../screens/GetStarted';
import NewPassword from '../screens/NewPassword';
import OTP from '../screens/OTP';
import SignIn from '../screens/SignIn';

const Stack = createNativeStackNavigator();
const AuthNavigator = () => {
  console.log('Welcome AuthNavigator');
  return (
    <>
      <View style={{flex: 1}}>
        <Stack.Navigator initialRouteName="GetStarted">
          <Stack.Screen
            name="GetStarted"
            component={GetStarted}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="OTP"
            component={OTP}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="NewPassword"
            component={NewPassword}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </View>
    </>
  );
};

export default AuthNavigator;
