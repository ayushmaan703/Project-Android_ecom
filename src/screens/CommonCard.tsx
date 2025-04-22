import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

const CommonCard = ({title, onClick}: any) => {
  return (
    <View style={{width: '100%', height: 70, justifyContent: 'center'}}>
      <TouchableOpacity
        style={style.parent}
        onPress={() => {
          onClick();
        }}>
        <View style={style.textParent}>
          <Text style={style.text}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const style = StyleSheet.create({
  parent: {
    width: '96%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: '#fff',
  },
  text: {
    marginLeft: 20,
    fontWeight: '600',
    color: 'red',
    fontSize: 16,
  },
  textParent: {
    marginLeft: 20,
    fontWeight: '600',
    color: '#6D6D6D',
    fontSize: 16,
  },
});
export default CommonCard;
