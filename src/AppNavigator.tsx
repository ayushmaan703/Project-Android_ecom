import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigator from './drawer navigation/DrawerNavigator';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
