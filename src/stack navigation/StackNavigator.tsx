import React, {useEffect, useState} from 'react';
import {
  Cart,
  Details,
  Home,
  LoginScreen,
  RegisterScreen,
  AdminRegisterScreen,
  AdminLoginScreen,
  VerificationScreen,
} from '../screens/index.js';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import {useSelector} from 'react-redux';
import {store} from '../store/store.js';

export type RootStackParamList = {
  Home: undefined;
  Details: {product: products};
  Cart: undefined;
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  AdminRegister: undefined;
  AdminLogin: undefined;
  Verify: undefined;
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator: React.FC<{navigation: any}> = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const auth = useSelector((state: any) => state.customer?.status);
  const adminAuth = useSelector((state: any) => state.admin?.status);
  console.log('is user logged in', auth);
  console.log('is admin logged in', adminAuth);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName={auth || adminAuth ? 'Home' : 'Login'}>
      {auth || adminAuth ? (
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="AdminLogin"
            component={AdminLoginScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Verify"
            component={VerificationScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AdminRegister"
            component={AdminRegisterScreen}
            options={{headerShown: false}}
          />
        </>
      )}
      <Stack.Screen
        name="Details"
        component={Details}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
