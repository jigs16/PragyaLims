import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, useColorScheme} from 'react-native';
import {BaseColor, Images} from '../config';
import DashboardNavigator from './DashboardNavigator';
import ProfileNavigator from './ProfileNavigator';
import ControlCenterNavigator from './ControlCenterNavigator';
import MISNavigator from './MISNavigator';
import {verticalScale} from '../config/scaling';

const Tab = createBottomTabNavigator();

export function BottomTabNavigator() {
  const isDarkMode = useColorScheme();
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        tabBarActiveTintColor: isDarkMode === 'dark' ? '#ccc' : '#000000',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          paddingTop: 14,
          backgroundColor:
            isDarkMode === 'dark' ? '#191919' : BaseColor.mainTransp,
          height: verticalScale(100),
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardNavigator}
        initialParams={{screenType: 1}}
        options={{
          tabBarLabel: '',
          unmountOnBlur: true,
          tabBarIcon: ({color, size, focused}) => (
            <Image
              source={focused ? Images.Dashboard : Images.Dashboard}
              // tintColor={'#eee'}
              style={{resizeMode: 'contain', width: focused ? 36 : 36}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ControlCenter"
        component={ControlCenterNavigator}
        initialParams={{screenType: 2}}
        options={{
          tabBarLabel: '',
          unmountOnBlur: true,
          tabBarIcon: ({color, size, focused}) => (
            <Image
              source={focused ? Images.ControlCenter : Images.ControlCenter}
              // tintColor={BaseColor.whiteColor}
              style={{resizeMode: 'contain', width: focused ? 36 : 36}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MIS"
        component={MISNavigator}
        initialParams={{screenType: 3}}
        options={{
          unmountOnBlur: true,
          tabBarLabel: '',
          tabBarIcon: ({color, size, focused}) => (
            <Image
              source={focused ? Images.MIS : Images.MIS}
              style={{resizeMode: 'contain', width: focused ? 36 : 36}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        initialParams={{screenType: 4}}
        options={{
          unmountOnBlur: true,
          tabBarLabel: '',
          tabBarIcon: ({color, size, focused}) => (
            <Image
              source={focused ? Images.Profilee : Images.Profilee}
              style={{resizeMode: 'contain', width: focused ? 36 : 36}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
