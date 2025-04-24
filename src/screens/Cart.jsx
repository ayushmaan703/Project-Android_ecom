import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

// interface CartItemProps {
//   item: {
//     id: string;
//     name: string;
//     price: string;
//     quantity: number;
//     image: any;
//   };
// }

// interface CartItemType {
//   id: string;
//   name: string;
//   price: string;
//   quantity: number;
//   image: any;
// }

const CartItem = ({item}) => (
  <View style={styles.cartItemContainer}>
    <Image source={item.image} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </View>
    <View style={styles.itemActions}>
      <Text style={styles.itemQuantity}>{item.quantity}</Text>
      <Icon name="trash-o" size={24} color="#B55E54" onPress={() => {}} />
    </View>
  </View>
);

const Cart = () => {
  const cartItems= [
    {
      id: '1',
      name: 'Prod Name',
      price: 'INR 210.000',
      quantity: 1,
      image: require('../data/product.png'),
    },
    {
      id: '2',
      name: 'Prod Name',
      price: 'INR 60.000',
      quantity: 3,
      image: require('../data/product.png'),
    },
    {
      id: '3',
      name: 'Prod Name',
      price: 'INR 40.000',
      quantity: 2,
      image: require('../data/product.png'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Icon name="arrow-back" size={24} color="#000" /> 
        <Text style={styles.headerTitle}>My Cart</Text>
      </View> */}

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={({item}) => <CartItem item={item} />}
        keyExtractor={item => item.id}
        style={styles.cartList}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerDetails}>
          <Text style={styles.footerText}>Total items (6)</Text>
          <Text style={styles.footerPrice}>INR 310.000</Text>
        </View>
        <View style={styles.footerDetails}>
          <Text style={styles.footerText}>Delivery fee</Text>
          <Text style={styles.footerPrice}>INR 10.000</Text>
        </View>
        <View style={styles.footerTotal}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>INR 320.000</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Check out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
  },
  cartList: {
    flex: 1,
    marginBottom: 20,
  },
  cartItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  itemPrice: {
    color: '#B55E54',
    fontSize: 14,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  footer: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  footerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  footerText: {
    fontSize: 14,
    color: '#000',
  },
  footerPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  footerTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B55E54',
  },
  checkoutButton: {
    backgroundColor: '#B55E54',
    paddingVertical: 10,
    borderRadius: 10,
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Cart;
