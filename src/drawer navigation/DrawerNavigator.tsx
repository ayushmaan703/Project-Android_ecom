import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import StackNavigator from '../stack navigation/StackNavigator';
import CustomDrawer from './CustomDrawer';
import MyAccount from '../screens/MyAccount';
import {Cart} from '../screens';

export type DrawerParamList = {
  Main: undefined;
  Account: undefined;
  Cart: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      // screenOptions={{
      //   drawerLockMode: 'unlocked',
      // }}
    >
      <Drawer.Screen
        name="Main"
        component={StackNavigator}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Account"
        component={MyAccount}
        options={{headerShown: true}}
      />
      <Drawer.Screen name="Cart" component={Cart} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
