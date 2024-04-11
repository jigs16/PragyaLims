import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {BaseColor} from '../config';
import EditProfile from '../screens/EditProfile';
import MyAccount from '../screens/MyAccount';
import Profile from '../screens/Profile';

const Stack = createNativeStackNavigator();
const ProfileNavigator = () => {
  return (
    <View style={{flex: 1, backgroundColor: BaseColor.whiteColor}}>
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyAccount"
          component={MyAccount}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default ProfileNavigator;
