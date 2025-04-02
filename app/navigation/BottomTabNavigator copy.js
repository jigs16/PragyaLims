import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import {BaseColor, Images} from '../config';
import DashboardNavigator from './DashboardNavigator';
import ProfileNavigator from './ProfileNavigator';
import {BottomFabBar} from 'rn-wave-bottom-bar';
import ControlCenterNavigator from './ControlCenterNavigator';
import MISNavigator from './MISNavigator';

const Tab = createBottomTabNavigator();

export function BottomTabNavigator() {
  console.log('Welcome Bottom Tab Navigator');
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: BaseColor.mainTransp,
        activeBackgroundColor: BaseColor.buttonGradient2,
        inactiveBackgroundColor: 'red',
        labelStyle: {
          color: 'white', // Change this to the desired color
        },
      }}
      tabBar={props => (
        <BottomFabBar
          mode="default"
          isRtl={false}
          focusedButtonStyle={{
            shadowColor: BaseColor.blackColor,
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.5,
            shadowRadius: 9.11,
            elevation: 14,
          }}
          bottomBarContainerStyle={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
          {...props}
        />
      )}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardNavigator}
        initialParams={{ screenType: 1 }}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color, size}) => (
            <Image
              source={Images.ic_home}
              style={{height: size, width: size, resizeMode: 'contain'}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ControlCenterNavigator"
        component={ControlCenterNavigator}
        initialParams={{ screenType: 2 }}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          tabBarLabel: 'Control Center',
          tabBarIcon: ({color, size}) => (
            <Image
              source={Images.ic_user}
              style={{height: size, width: size, resizeMode: 'contain'}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MISNavigator"
        component={MISNavigator}
        initialParams={{ screenType: 3 }}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          tabBarLabel: 'MIS',
          tabBarIcon: ({color, size}) => (
            <Image
              source={Images.ic_user}
              style={{height: size, width: size, resizeMode: 'contain'}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        initialParams={{ screenType: 4 }}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Image
              source={Images.ic_user}
              style={{height: size, width: size, resizeMode: 'contain'}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
