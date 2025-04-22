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
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  changePassword,
  updateUserDetails
} from '../store/slice/customer.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminControlPanel from "../adminControls/AdminControlPanel"
import { customerLogout } from '../store/slice/customer.slice';
const logout = <Icon name="sign-out-alt" size={18} color="#fff" />;
const MyAccount = () => {

  const showToast = (type = 'info', message = 'Something happened!') => {
    Toast.show({
      type: type, // 'success', 'error', 'info'
      text1: message,
    });
  };

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  let user = useSelector((state) => state.customer?.userData);
  const isAdmin = useSelector((state) => state.admin?.status)

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
    const response = await dispatch(customerLogout())
    if (response.payload === "User logged Out") {
      showToast("success", "logged out successfully")
      navigation.reset()
      user = undefined
    }
    else {
      showToast("error", "Error loging out")
      console.log(response.payload);

    }
  }

  return (
    isAdmin ? <AdminControlPanel /> :
      (<SafeAreaView style={styles.container}>
        {/* Profile Header */}
        {user != undefined ? (
          <View style={styles.profileHeader}>
            <Image
              style={styles.profileImage}
              source={{ uri: user.photo }}
            />
            <Text style={styles.userName}>{user.customerName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
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
            <Text style={styles.optionText} onPress={() => setDetailsModalVisible(true)}>Update Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => setPasswordModalVisible(true)}>
            <Text style={styles.optionText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Order History</Text>
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

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.logoutText}>{logout}</Text>
              <Text style={styles.logoutText} > Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>)

  );
};

export default MyAccount;

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
  },
});
