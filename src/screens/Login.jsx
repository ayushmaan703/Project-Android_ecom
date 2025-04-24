import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import AdminLoginScreen from '../adminControls/AdminLogin.jsx';
import { useNavigation } from '@react-navigation/native';
import { customerLogin } from '../store/slice/customer.slice.js';
import messaging from '@react-native-firebase/messaging';
const LoginScreen = () => {

  useEffect(() => {
    requestNotificationPermission();
    subscribeToTopic();
  }, []);

  const dispatch = useDispatch();
  const [fcmToken, setFcmToken] = useState(null);
  const navigation = useNavigation()
  const [isClicked, setIsClicked] = useState("customer")
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const subscribeToTopic = async () => {
    try {
      await messaging().subscribeToTopic('allUsers');
      console.log('Subscribed to allUsers topic');
    } catch (err) {
      console.log('Error subscribing to topic:', err);
    }
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getFcmToken();
        }
        else {
          getFcmToken();
        }

      } catch (err) {
        console.warn(err);
      }
    }

  };

  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken()
      if (token) {
        setFcmToken(token);
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  const showToast = (userName) => {
    Toast.show({
      type: 'success', // 'success', 'error', 'info'
      text1: `Hello ${userName}!`,
    });
  };

  const handleLogin = async (
    values,
    { resetForm }
  ) => {
    try {
      const data = { ...values, fcm: fcmToken }
      const result = await dispatch(customerLogin(data))
      if (result.type === "customerLogin/fulfilled") {
        navigation.replace('Home');
        showToast(result.payload.customerName)
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }

      resetForm();
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('An error occurred', error);
    }
  };

  return (isClicked == "admin" ? <AdminLoginScreen /> :
    (<Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={handleLogin}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => setIsClicked("customer")}
            >
              <Text style={[styles.loginTitle, isClicked == "customer" ? styles.borderActive : styles.borderInactive]}>Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsClicked("admin")}
            >
              <Text style={[styles.loginTitle, isClicked == "admin" ? styles.borderActive : styles.borderInactive]}>Admin</Text>
            </TouchableOpacity>
          </View>
          {/* {avatar && <Image source={{uri: avatar}} style={styles.avatar} />}
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={handleChooseAvatar}>
              <Text style={styles.avatarButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={handleTakePhoto}>
              <Text style={styles.avatarButtonText}>Take a Photo</Text>
            </TouchableOpacity>
          </View> */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#000"
            style={styles.input}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          {touched.email && errors.email && (
            <Text style={styles.error}>{errors.email}</Text>
          )}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#000"
            style={styles.input}
            secureTextEntry
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
          />
          {touched.password && errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmit()}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Don't have an account? Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Verify')}>
            <Text style={styles.link}>Verification Status </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>)
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: '500'
  },
  borderInactive: {
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginBottom: 20
  },
  borderActive: {
    borderBottomColor: "#007BFF",
    borderBottomWidth: 1
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 20,
    marginBottom: 10,
    color: '#000',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  link: {
    color: '#007BFF',
    marginTop: 10
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  error: { color: 'red', fontSize: 12 },
});
export default LoginScreen;
