import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { RkText } from 'react-native-ui-kitten'
import { KittenTheme } from "../../../../config/theme";
import * as Variable from '../../../constants/variable'
import { styleContainer } from '../../../stylesContainer';

export default function HomeLogo(props) {
  /*return <View style={[styles.container, styleContainer.boxShadow, {paddingLeft: props.left ? 12 : 6, paddingRight: props.left ? 6 : 12}]}>
      <TouchableOpacity activeOpacity={1} onPress={props.onPress} style={{paddingTop: props.index === 0 ? 10 : 0}}>
      <View style={[styles.touchableOpacity, styleContainer.boxShadow]}>
        <View>
          <Image
            source={props.source}
            style={styles.image} />
        </View>
        <RkText rkType="" style={styles.text}>{props.title}</RkText>
        </View>
      </TouchableOpacity>
    </View>*/
  return (
  <TouchableOpacity activeOpacity={1} onPress={props.onPress} style={{flex: 1}}>
    <Image
      source={props.source}
      style={styles.image} />
    <Text style={styles.text}>{props.title}</Text>
  </TouchableOpacity>
  )
}

let paddingHorizontal = 20
let padding = 20
let paddingVertical = Variable.PLATFORM_IOS ? 0 : 20

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"center"
  },
  touchableOpacity: {
    backgroundColor: KittenTheme.colors.white,
    borderRadius: KittenTheme.border.borderRadius,
    height: '95%',
    justifyContent:"center"
  },

  image: {
    width: Variable.IS_TABLET || Variable.IS_IPAD ? 160 : Variable.DEVICE_WIDTH / 2 - (4 * paddingHorizontal) - padding,
    height: Variable.IS_TABLET || Variable.IS_IPAD ? 160 : Variable.DEVICE_WIDTH / 2 - (4 * paddingHorizontal) - padding,
    alignSelf: 'center'
  },
  /*text: {
    alignSelf: 'center',
    color: KittenTheme.colors.primaryText,
    textAlign: 'center',
  }*/
  text: {
    alignSelf: 'center',
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: "700"
  }
})
