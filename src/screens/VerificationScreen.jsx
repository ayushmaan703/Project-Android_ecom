import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { userLogin } from '../store/slice/auth.slice.js';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

const VerificationScreen = () => {
    const dispatch = useDispatch();

    const handleLogin = async (
        values,
        { resetForm }
    ) => {
        try {
            const result = await dispatch(userLogin(values))
            if (result.payload == undefined) {
                Alert.alert('verified');
            } else {
                if (result.payload.verified === false) {
                    Alert.alert('Not verified');
                }
            }
            resetForm();
        } catch (error) {
            Alert.alert('An error occurred');
        }
    };

    const loginSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });


    return (
        <Formik
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
                    <Text style={styles.title}>Verification Status</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                    </View>
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
                        <Text style={styles.buttonText}>Check</Text>
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
export default VerificationScreen;
