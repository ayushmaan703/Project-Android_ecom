// import {StyleSheet, Text, View} from 'react-native';
// import React, {useEffect} from 'react';
// import {RootStackParamList} from '../stack navigation/StackNavigator';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';

// type HomeProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

// const SplashScreen = ({navigation}: HomeProps) => {
//   useEffect(() => {
//     setTimeout(() => {
//       navigation.navigate('Home');
//     }, 2000);
//   }, []);
//   return (
//     <View >
//       <Text style={styles.container}>SplashScreen</Text>
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     fontSize: 20,
//     color: '#000',
//   },
// });
import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';

const SplashScreen = () => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Image source={require('../data/image.jpg')} style={styles.logo} />
        {/* <ActivityIndicator size="large" color="#d26e5b" style={styles.loader} /> */}
        <Text style={styles.text}>Name</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FD8B51',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 100,
  },
  loader: {
    marginTop: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 30,
    color: '#fff',
  },
});

export default SplashScreen;
