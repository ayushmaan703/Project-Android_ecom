import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, makeProductsNull } from '../store/slice/products.slice.js';
import { RefreshControl } from 'react-native-gesture-handler';

// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {RootStackParamList} from '../stack navigation/StackNavigator.js';
// import {DrawerNavigationProp} from '@react-navigation/drawer';
// import {DrawerParamList} from '../drawer navigation/DrawerNavigator.js';
// import {AppDispatch} from '../stack navigation/StackNavigator.js';
// type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const menu = <Icon name="bars" size={20} color="#000" />;
const search = <Icon name="search" size={15} color={'#000'} />;


export default function App({ navigation }) {

  const dispatch = useDispatch();
  // let prod = useSelector((state:any) => state.prod?.products);
  const products = useSelector((state) => state?.prod?.products)
  const hasNextPage = useSelector((state) => state.prod?.products?.hasNextPage);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);


  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getAllProducts({}))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    dispatch(getAllProducts({}));
    return () => dispatch(makeProductsNull());
  }, [dispatch]);

  // const fetchMoreStock = useCallback(() => {
  //   if (hasNextPage) {
  //     dispatch(getAllProducts({ page: page + 1 }));
  //     setPage((prev) => prev + 1);
  //   }
  // }, [page, hasNextPage, dispatch]);

  const drawerNavigation =
    // navigation.getParent<DrawerNavigationProp<DrawerParamList>>();
    navigation.getParent();
  const openDrawer = () => {
    drawerNavigation?.openDrawer();
  };

  return (

    <View style={styles.container}>
      {/* Navbar */}

      <View style={styles.nav}>
        <TouchableOpacity
          onPress={() => {
            openDrawer();
          }}>
          <Text>{menu}</Text>
        </TouchableOpacity>
        <Text style={styles.name}>App Name</Text>

        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('Cart');
          }}>
          <Text>{cart}</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navIcon}>👤</Text>
          </TouchableOpacity> */}
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 20,
              marginLeft: 10,
              color: '#d26e5b',
              fontWeight: 'bold',
            }}>
            Hello,
          </Text>
          <Text
            style={{
              color: '#000',
              fontSize: 15,
              marginTop: 5,
              marginLeft: 5,
            }}>
            Name got the best deals for you
          </Text>
        </View>

        {/* Search Bar */}

        <View style={styles.searchContainer}>
          <Text style={styles.searchButton}> {search} </Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#000"
          />
        </View>

        {/* Discount Banner */}
        {/* 1 */}

        {/* Categories */}
        {/* <View style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryButton}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Products */}

        <View style={styles.productRow}>
          {products?.docs.map((item, index) => {
            return (
              <Pressable
                key={index}
                style={[
                  styles.productCard,
                  // index % 2 === 0 ? styles.cardShiftUp : styles.cardShiftDown,
                ]}
                onPress={() => {
                  navigation.navigate('Details', {
                    product: item,
                  });
                }}>
                <View style={styles.cardData}>
                  {/* Product Image */}
                  <View style={styles.imageWrapper}>
                    <Image src={item.photo.url} style={styles.productImage} />
                  </View>

                  {/* Product Details */}
                  <View style={styles.textWrapper}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productOriginalPrice}>
                      {item.discount}
                    </Text>
                    <Text style={styles.productPrice}>{item.discount}</Text>
                  </View>
                </View>

                {/* Buy Button */}
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    navigation.navigate('Details', {
                      product: item,
                    });
                  }}>
                  <Text style={styles.addButtonText}>Buy Now</Text>
                </TouchableOpacity>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E5BF',
    paddingHorizontal: 5,
  },
  banner: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
    marginVertical: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 15,
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
  },
  bannerTextBold: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  getButton: {
    backgroundColor: '#D2691E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  getButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 20,
    color: '#000',
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    elevation: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    color: '#000',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20, // Apply only to right corners
  },
  searchButton: {
    backgroundColor: '#f8f8f8',
    height: '100%',
    width: 30,
    paddingTop: 15,
    paddingLeft: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20, // Apply only to left corners
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#d26e5b',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 10,
    // backgroundColor: '#F8F0E3',
    // elevation: 10,
    alignItems: 'center',
    zIndex: 10,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  productRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  productCard: {
    backgroundColor: '#F8F0E3',
    borderRadius: 10,
    marginBottom: 20,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 30,
    padding: 15,
    overflow: 'hidden',
    height: 320,
  },

  cardShiftUp: {
    marginTop: 30,
  },
  cardShiftDown: {
    marginBottom: 10,
  },
  cardData: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  textWrapper: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productOriginalPrice: {
    fontSize: 14,
    color: '#777',
    textDecorationLine: 'line-through',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#d26e5b',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
