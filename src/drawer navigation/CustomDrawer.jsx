import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { customerLogout } from '../store/slice/customer.slice';
import { adminLogout } from '../store/slice/adminControl.slice';
const home = <Icon name="home" size={18} color="#fff" />;
const cart = <Icon name="shopping-cart" size={18} color="#fff" />;
const logout = <Icon name="sign-out-alt" size={18} color="#fff" />;
const CustomDrawer = (props) => {

  const showToast = (type = 'info', message = 'Something happened!') => {
    Toast.show({
      type: type, // 'success', 'error', 'info'
      text1: message,
    });
  };

  const { navigation } = props;
  const user = useSelector((state) => state.customer?.userData);
  const adminData = useSelector((state) => state.admin?.adminData);
  const isAdmin = useSelector((state) => state.admin?.status)
  const dispatch = useDispatch();

  const handleLogout = async () => {
    let response
    if (isAdmin) {
      response = await dispatch(adminLogout())
    }
    else {
      response = await dispatch(customerLogout())
    }
    if (response.type == "customerLogout/fulfilled") {
      navigation.reset()
      showToast("success", "logged out successfully")
      user = undefined
      adminData = undefined
    }
    else {
      showToast("error", "Error loging out")
    }
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        {/* <Text style={styles.headerText}>My Custom Drawer</Text> */}
        <TouchableOpacity
          style={styles.ACButton}
          onPress={() => {
            navigation.navigate('Account');
          }}>
          {isAdmin ?
            adminData != undefined ? (<Image
              style={styles.profileImage}
              source={{ uri: adminData.photo }}
            />) : (<Image
              style={styles.profileImage}
              source={{ uri: 'https://via.placeholder.com/150' }}
            />)
            :
            user != undefined ? (<Image
              style={styles.profileImage}
              source={{ uri: user.photo }}
            />) : (<Image
              style={styles.profileImage}
              source={{ uri: 'https://via.placeholder.com/150' }}
            />)}

          {/* <View>
              <Text style={styles.welcome}> Welcome, </Text>
              <Text style={styles.name}> name </Text>
            </View> */}
        </TouchableOpacity>
      </View>

      <DrawerContentScrollView {...props} style={styles.body}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => {
            navigation.navigate('Main');
          }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={styles.buttonText}>{home} </Text>
            <Text style={styles.buttonText}> Home</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => {
            navigation.navigate('Cart');
          }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={styles.buttonText}>{cart} </Text>
            <Text style={styles.buttonText}> Cart</Text>
          </View>
        </TouchableOpacity>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.buttonText}>{logout} </Text>
            <Text style={styles.buttonText}> Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 150,
    backgroundColor: '#257180',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
  },
  // welcome: {
  //   marginLeft: 15,
  //   color: '#fff',
  //   fontSize: 30,
  // },
  // name: {
  //   marginLeft: 25,
  //   color: '#fff',
  //   fontSize: 18,
  //   marginBottom:25
  // },

  headerText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  ACButton: {
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 5,
  },
  customButton: {
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#d26e5b',
    borderRadius: 5,
  },
  logoutButton: {
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#B22222',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },

  body: {
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 70,
    marginBottom: 10,
    backgroundColor: '#000',
  },
});

export default CustomDrawer;
