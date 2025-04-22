import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    changePassword,
    adminLogout,
    updateUserDetails,
    verifyUser
} from '../store/slice/adminControl.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { deleteAProd, getAllProducts, makeProductsNull, publishAProduct, updateDiscount } from '../store/slice/products.slice';
import { getWaitlist } from '../store/slice/waitlist.slice';
const logout = <Icon name="sign-out-alt" size={18} color="#fff" />;
const AdminControlPanel = () => {

    const showToast = (type = 'info', message = 'Something happened!') => {
        Toast.show({
            type: type, // 'success', 'error', 'info'
            text1: message,
        });
    };

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [photo, setphoto] = useState(null);
    const [updatephoto, setUpdatephoto] = useState(null);
    const [addStock, setAddStock] = useState(false)
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [waitlistModalVisible, setWaitlistModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [updateStockModalVisible, setUpdateStockModalVisible] = useState(false);
    const [updateStockDetailsModalVisible, setUpdateStockDetailsModalVisible] = useState(false);
    const [deleteStockModalVisible, setDeleteStockModalVisible] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newFullName, setNewFullName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [stockUpdateData, setStockUpdateData] = useState(null);

    const adminDetails = useSelector((state) => state.admin?.adminData)
    const waitlistData = useSelector((state) => state.waiting?.waitlistData) || []
    const products = useSelector((state) => state?.prod?.products)

    const StockSchema = Yup.object().shape({
        name: Yup.string().required('Product name is required'),
        discount: Yup.number()
            .required('Discount on this product is required')
            .typeError("Discount must be a number"),
        quantity: Yup.number()
            .required('Quantity of product is required')
            .typeError("Quantity must be a number"),
    });
    const StockUpdateSchema = Yup.object().shape({
        discount: Yup.number()
            .required('Discount on this product is required')
            .typeError("Discount must be a number"),
    });

    const handleUpdateStock = async (data) => {
        setUpdatephoto(data.photo.url)
        setUpdateStockDetailsModalVisible(true)
        setStockUpdateData(data)
    }
    const handleUpdateStock1 = async (data) => {
        let prodId = stockUpdateData._id
        const response = await dispatch(updateDiscount({ prodId, data }))
        if (response.type === "updateDiscount/fulfilled") {
            showToast("success", "Stock updated successfully")
            await dispatch(makeProductsNull())
            await dispatch(getAllProducts({}))
        }
        else {
            showToast("error", "Error updating")
        }
    }

    const handleDeleteStock = async (data) => {
        const response = await dispatch(deleteAProd(data._id))
        if (response.type === "deleteAProd/fulfilled") {
            showToast("success", "Stock deleted successfully")
            await dispatch(makeProductsNull())
            await dispatch(getAllProducts({}))
        }
        else {
            showToast("error", "Error deleting")
        }
    }

    const handleVerifyUser = async (data) => {
        const response = await dispatch(verifyUser(data))
        if (response.type === "verifyUser/fulfilled") {
            showToast("success", "User Verified successfully")
        }
        else {
            showToast("error", "Error verifying")
        }
    }

    const handleWaitlist = async () => {
        await dispatch(getWaitlist())
    }

    const handlePublishStock = async (values, { resetForm }) => {
        const data = { ...values, photo: photo }
        try {
            const result = await dispatch(publishAProduct(data))
            if (result.type === "publishAProduct/fulfilled") {
                await dispatch(makeProductsNull())
                await dispatch(getAllProducts({}))
                showToast("success", "Product posted successfully")
            } else {
                Alert.alert('Publish Failed');
            }
            resetForm();
        } catch (error) {
            console.error('Publish Error:', error);
            Alert.alert('An error occurred', error);
        }
    }

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

    const handleUpdateDetails = async () => {
        const data = { fullName: newFullName, email: newEmail }
        const response = await dispatch(updateUserDetails(data))
        if (response.type == "updateUserDetails/fulfilled") {
            showToast("success", "Account details updated successfully")
        }
        else {
            showToast("error", "failed to update details ")
        }
        setNewEmail("")
        setNewFullName("")
    }

    const handleChangePassword = async () => {
        const data = {
            password: currentPassword,
            newPassword: newPassword
        }
        const response = await dispatch(changePassword(data))
        if (response.type == "changePassword/fulfilled") {
            showToast("success", "password changed successfully")
        }
        else {
            showToast("error", "password change failed")
        }
        setCurrentPassword("");
        setNewPassword("")

    }

    const handleLogout = async () => {
        const response = await dispatch(adminLogout())
        if (response.payload === "User logged Out") {
            navigation.reset()
            showToast("success", "logged out successfully")
            user = undefined
        }
        else {
            showToast("error", "Error loging out")

        }
    }

    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                {/* Profile Header */}
                {adminDetails != undefined ? (
                    <View style={styles.profileHeader}>
                        <Image
                            style={styles.profileImage}
                            source={{ uri: adminDetails.photo }}
                        />
                        <Text style={styles.userName}>{adminDetails.userName}</Text>
                        <Text style={styles.userEmail}>{adminDetails.email}</Text>
                    </View>)
                    :
                    (<View style={styles.profileHeader}>
                        <Image
                            style={styles.profileImage}
                            source={{ uri: 'https://via.placeholder.com/150' }}
                        />
                        <Text style={styles.userName}>asdf</Text>
                        <Text style={styles.userEmail}>asdf</Text>
                    </View>)}

                {/* Account Options */}
                <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText} onPress={() => setAddStock(!addStock)}>Add stock
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}
                        onPress={() =>
                            setUpdateStockModalVisible(true)
                        }>
                        <Text style={styles.optionText}>Update stock</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}
                        onPress={() =>
                            setDeleteStockModalVisible(true)
                        }>
                        <Text style={styles.optionText} >Delete stock</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText} onPress={() => {
                            handleWaitlist(),
                                setWaitlistModalVisible(true)
                        }}>
                            Verify user</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText} onPress={() => setDetailsModalVisible(true)}>Update Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={() => setPasswordModalVisible(true)}>
                        <Text style={styles.optionText}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
                        <Text style={styles.optionText}>Settings</Text>
                    </TouchableOpacity>

                </View>

                {/*Password modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={passwordModalVisible}
                    onRequestClose={() => setPasswordModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Change Password</Text>

                            <TextInput
                                style={styles.input}
                                placeholderTextColor="#000"
                                placeholder="Current Password"
                                secureTextEntry
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />
                            <TextInput
                                style={styles.input}
                                placeholderTextColor="#000"
                                placeholder="New Password"
                                // secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />

                            <View style={styles.buttonContainer}>
                                <Button title="Submit" onPress={() => {
                                    handleChangePassword()
                                    setPasswordModalVisible(false)
                                }} />
                                <Button
                                    title="Cancel"
                                    color="red"
                                    onPress={() => setPasswordModalVisible(false)}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

                {/*details modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={detailsModalVisible}
                    onRequestClose={() => setDetailsModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Update Details</Text>

                            <TextInput
                                style={styles.input}
                                placeholderTextColor="#000"
                                placeholder="Fullname"
                                value={newFullName}
                                onChangeText={setNewFullName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholderTextColor="#000"
                                placeholder="New Email"
                                value={newEmail}
                                onChangeText={setNewEmail}
                            />

                            <View style={styles.buttonContainer}>
                                <Button title="Submit" onPress={() => {
                                    handleUpdateDetails()
                                    setDetailsModalVisible(false)
                                }} />
                                <Button
                                    title="Cancel"
                                    color="red"
                                    onPress={() => setDetailsModalVisible(false)}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* add stock form */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={addStock}
                    onRequestClose={() => setAddStock(false)}
                >
                    <View style={styles.stockOverlay}>
                        <View style={styles.stockModalContainer}>
                            <Formik
                                initialValues={{ name: '', discount: '', quantity: '' }}
                                validationSchema={StockSchema}
                                onSubmit={handlePublishStock}>
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    values,
                                    errors,
                                    touched,
                                }) => (
                                    <View style={styles.stockContainer}>
                                        <Text style={styles.title}>Publish Stock</Text>
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
                                            placeholder="Product Name"
                                            placeholderTextColor="#000"
                                            style={styles.stockInput}
                                            onChangeText={handleChange('name')}
                                            onBlur={handleBlur('name')}
                                            value={values.name}
                                        />
                                        {touched.name && errors.name && (
                                            <Text style={styles.error}>{errors.name}</Text>
                                        )}
                                        <TextInput
                                            placeholder="Quantity"
                                            placeholderTextColor="#000"
                                            style={styles.stockInput}
                                            onChangeText={handleChange('quantity')}
                                            onBlur={handleBlur('quantity')}
                                            value={values.userName}
                                        />
                                        {touched.quantity && errors.quantity && (
                                            <Text style={styles.error}>{errors.quantity}</Text>
                                        )}
                                        <TextInput
                                            placeholder="Discount"
                                            placeholderTextColor="#000"
                                            style={styles.stockInput}
                                            onChangeText={handleChange('discount')}
                                            onBlur={handleBlur('discount')}
                                            value={values.discount}
                                        />
                                        {touched.discount && errors.discount && (
                                            <Text style={styles.error}>{errors.discount}</Text>
                                        )}
                                        <View style={styles.buttonContainer}>
                                            <Button title="Submit" onPress={() => {
                                                handleSubmit()
                                                setAddStock(false)
                                            }} />
                                            <Button
                                                title="Cancel"
                                                color="red"
                                                onPress={() => setAddStock(false)}
                                            />
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </View>

                </Modal>

                {/* Verify user list */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={waitlistModalVisible}
                    onRequestClose={() => setWaitlistModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Verify User</Text>
                            <View style={styles.listContainer}>
                                {(waitlistData.length == 0) ?
                                    <Text style={styles.modalTitle}>No New User</Text> :
                                    <FlatList
                                        data={waitlistData}
                                        keyExtractor={(item) => item._id}
                                        renderItem={({ item }) => (
                                            <View style={styles.listItem}>
                                                <Text style={styles.listText}>{item.list[0].userName}</Text>
                                                <View style={styles.buttonContainer}>
                                                    <Button
                                                        title="Allow"
                                                        color="green"
                                                        onPress={() => {
                                                            setWaitlistModalVisible(false),
                                                                handleVerifyUser("true")
                                                        }} />
                                                    <Button
                                                        title="deny"
                                                        color="red"
                                                        onPress={() => {
                                                            setWaitlistModalVisible(false),
                                                                handleVerifyUser("false")
                                                        }} />
                                                </View>
                                            </View>
                                        )}
                                    />}
                            </View>
                            <Button
                                title="Cancel"
                                color="red"
                                onPress={() => setWaitlistModalVisible(false)}
                            />

                        </View>
                    </View>
                </Modal>

                {/* delete Stock modal   */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={deleteStockModalVisible}
                    onRequestClose={() => setDeleteStockModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Delete Stock</Text>
                            <View style={styles.listContainer}>
                                <FlatList
                                    data={products.docs}
                                    keyExtractor={(item) => item._id}
                                    renderItem={({ item }) => (
                                        <View style={styles.listItem}>
                                            <Text style={styles.listText}>{item.name}</Text>
                                            <Button
                                                title="delete"
                                                color="red"
                                                onPress={() => {
                                                    setDeleteStockModalVisible(false)
                                                    handleDeleteStock(item)
                                                }} />
                                        </View>
                                    )}
                                />
                            </View>
                            <Button
                                title="Cancel"
                                color="red"
                                onPress={() => setDeleteStockModalVisible(false)}
                            />

                        </View>
                    </View>
                </Modal>

                {/* update stock modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={updateStockModalVisible}
                    onRequestClose={() => setUpdateStockModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Update Stock</Text>
                            <View style={styles.listContainer}>
                                <FlatList
                                    data={products.docs}
                                    keyExtractor={(item) => item._id}
                                    renderItem={({ item }) => (
                                        <View style={styles.listItem}>
                                            <Text style={styles.listText}>{item.name}</Text>
                                            <Button
                                                title="tick"
                                                onPress={() => {
                                                    setUpdateStockModalVisible(false)
                                                    handleUpdateStock(item)
                                                }} />
                                        </View>
                                    )}
                                />
                            </View>
                            <Button
                                title="Cancel"
                                color="red"
                                onPress={() => setUpdateStockModalVisible(false)}
                            />

                        </View>
                    </View>
                </Modal>

                {/* update stock details  */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={updateStockDetailsModalVisible}
                    onRequestClose={() => setUpdateStockDetailsModalVisible(false)}
                >
                    <View style={styles.stockOverlay}>
                        <View style={styles.stockModalContainer}>
                            <Formik
                                initialValues={{ discount: '' }}
                                validationSchema={StockUpdateSchema}
                                onSubmit={handleUpdateStock1}>
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    values,
                                    errors,
                                    touched,
                                }) => (
                                    <View style={styles.stockContainer}>
                                        <Text style={styles.title}>Update Stock</Text>
                                        {updatephoto && <Image source={{ uri: updatephoto }} style={styles.photo} />}
                                        <Text style={{
                                            width: '100%',
                                            padding: 10,
                                            marginBottom: 10,
                                            color: '#000',
                                            fontWeight:'bold'
                                        }}>Current Discount : {stockUpdateData.discount}</Text>
                                        <TextInput
                                            placeholder="New Discount"
                                            placeholderTextColor="#000"
                                            style={styles.stockInput}
                                            onChangeText={handleChange('discount')}
                                            onBlur={handleBlur('discount')}
                                            value={values.discount}
                                        />
                                        {touched.discount && errors.discount && (
                                            <Text style={styles.error}>{errors.discount}</Text>
                                        )}
                                        <View style={styles.buttonContainer}>
                                            <Button title="Submit" onPress={() => {
                                                handleSubmit()
                                                setUpdateStockDetailsModalVisible(false)
                                            }} />
                                            <Button
                                                title="Cancel"
                                                color="red"
                                                onPress={() => setUpdateStockDetailsModalVisible(false)}
                                            />
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </View>
                </Modal>


                {/* Logout Button */}
                <View style={styles.logoutContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.logoutText}>{logout}</Text>
                            <Text style={styles.logoutText} > Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default AdminControlPanel;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    userName: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 16,
        color: 'gray',
    },
    optionsContainer: {
        marginTop: 20,
    },
    optionButton: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        color: '#000',
        fontSize: 16,
    },
    logoutContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#d22222',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    logoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        color: "#000"
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: "70%"
    },
    stockContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    stockInput: {
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
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20
    },
    photoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    photoButton: {
        marginHorizontal: 10
    },
    photoButtonText: {
        color: '#007BFF'
    },
        error: {
            color: 'red',
            fontSize: 12
        },
    stockOverlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    stockModalContainer: {
        padding: 20,
        backgroundColor: "#FFF",
        borderRadius: 10,
        elevation: 10,
        width: "85%",
        height: "85%"
    },
    listContainer: {
        // flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    listItem: {
        padding: 15,
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        width: "99%",
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    listText: {
        fontSize: 18
    },
});
