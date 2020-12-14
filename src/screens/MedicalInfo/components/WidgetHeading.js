import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { View } from 'react-native';

import { Icon } from 'react-native-elements';
import { RkText } from 'react-native-ui-kitten';

export default function WidgetHeading(props) {
  const {
    title,
    icon,
    iconType,
    iconColor,
    containerStyle,
    contentStyle,
  } = props;

  return (
    <View
      style={[
        tw.flexRow,
        tw.w32,
        tw.roundedFull,
        tw.itemsCenter,
        containerStyle,
      ]}
    >
      <View
        style={[
          tw.w8,
          tw.h8,
          tw.roundedFull,
          tw.itemsCenter,
          tw.justifyCenter,
          contentStyle,
        ]}
      >
        <Icon name={icon} size={18} type={iconType} color={iconColor} />
      </View>
      <View style={tw.w2} />
      <RkText style={tw.w24}>{title}</RkText>
    </View>
  );
}
