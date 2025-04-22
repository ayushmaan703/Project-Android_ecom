import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createAccount } from '../store/slice/auth.slice';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';

const RegisterScreen = ({ navigation }) => {
  const showToast = (userName) => {
    Toast.show({
      type: 'success', // 'success', 'error', 'info'
      text1: `Hello ${userName}!`,
    });
  };
  const [photo, setphoto] = useState(null);
  const dispatch = useDispatch();

  const RegistrationSchema = Yup.object().shape({
    userName: Yup.string().required('Username is required'),
    fullName: Yup.string().required('Fullname is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });
  const handleRegistration = async (
    values,
    { resetForm }
  ) => {
    const data = { ...values, photo: photo }
    try {
      const result = await dispatch(createAccount(data))
      if (result.type === "createAccount/fulfilled") {
        navigation.replace('Login');
      } else {
        Alert.alert('Registration Failed');
      }

      resetForm();
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('An error occurred', error);
    }
  };

  const handleChoosephoto = async () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', includeBase64: true },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Something went wrong');
          return;
        }
        if (response.assets && response.assets[0].uri) {
          setphoto(response.assets[0].uri);
        }
      },
    );
  };

  const handleTakePhoto = async () => {
    ImagePicker.launchCamera(
      { mediaType: 'photo', includeBase64: true },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Something went wrong');
          return;
        }
        if (response.assets && response.assets[0].uri) {
          setphoto(response.assets[0].uri);
        }
      },
    );
  };

  return (
    <Formik
      initialValues={{ fullName: '', userName: '', email: '', password: '' }}
      validationSchema={RegistrationSchema}
      onSubmit={handleRegistration}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
          {photo && <Image source={{ uri: photo }} style={styles.photo} />}
          <View style={styles.photoContainer}>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={handleChoosephoto}>
              <Text style={styles.photoButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={handleTakePhoto}>
              <Text style={styles.photoButtonText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Fullname"
            placeholderTextColor="#000"
            style={styles.input}
            onChangeText={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
            value={values.fullName}
          />
          {touched.fullName && errors.fullName && (
            <Text style={styles.error}>{errors.fullName}</Text>
          )}
          <TextInput
            placeholder="Username"
            placeholderTextColor="#000"
            style={styles.input}
            onChangeText={handleChange('userName')}
            onBlur={handleBlur('userName')}
            value={values.userName}
          />
          {touched.userName && errors.userName && (
            <Text style={styles.error}>{errors.userName}</Text>
          )}
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
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
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
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#007BFF', marginTop: 10 },
  photo: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  photoButton: { marginHorizontal: 10 },
  photoButtonText: { color: '#007BFF' },
  error: { color: 'red', fontSize: 12 },
});

export default RegisterScreen;
