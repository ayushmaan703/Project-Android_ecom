import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ImageBackground,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../stack navigation/StackNavigator';
import {useNavigation} from '@react-navigation/native';

const menu = <Icon name="angle-left" size={28} color="#000" />;

// type DetailsProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

// const Detail = ({route}: DetailsProps) => {
const Detail = ({route}) => {
  const {product} = route.params;
  
  const [quantity, setQuantity] = useState(1);

  const navigation = useNavigation();

  const handleInputChange = (input) => {
    const parsedValue = parseInt(input, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setQuantity(parsedValue);
    } else {
      setQuantity(1);
    }
  };

  const handleQuantityChange = (action) => {
    if (action === 'increment') {
      setQuantity(prevQuantity => prevQuantity + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Icons */}
        <ImageBackground src={product.photo.url} style={styles.image}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.arrow}
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name="angle-left" size={30} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.heart}>
              <Icon name="heart-o" size={25} color="#000" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        {/*  Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.name}</Text>
          {/* <Text style={styles.description}>
            Perfectly rich and moist black forest cake made from scratch with a
            delicious chocolate sponge cake layers filled with homemade whipped
            cream and cherries.
          </Text> */}
          <Text style={styles.productOriginalPrice}>{product.discount}</Text>
          <Text style={styles.price}>{product.discount}</Text>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange('decrement')}>
              <Icon name="minus" size={15} color="#000" />
            </TouchableOpacity>
            <TextInput
              value={String(quantity)}
              onChangeText={handleInputChange}
              editable={true}
              style={styles.quantityInput}
            />
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange('increment')}>
              <Icon name="plus" size={15} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    elevation: 10,
    alignItems: 'center',
    zIndex: 10,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    marginBottom: 3,
  },
  heart: {
    paddingHorizontal: 4,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F8F0E3',
    elevation: 30,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  arrow: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#F8F0E3',
    elevation: 30,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  container: {
    // marginTop: 3,
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  image: {
    resizeMode: 'contain',
    height: 400,
    width: 'auto',
    padding: 5,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F0E3',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  title: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
  productOriginalPrice: {
    fontSize: 14,
    color: '#777',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d26e5b',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 16,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quantityInput: {
    width: 40,
    height: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#d26e5b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Detail;
