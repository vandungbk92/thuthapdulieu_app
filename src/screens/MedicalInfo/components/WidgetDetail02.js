import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { View, FlatList } from 'react-native';

import { RkText } from 'react-native-ui-kitten';

import { formatNumber } from '../../../helper/numberFormat';

const textStyles = [tw.textGreen500, tw.textRed500];
const backgroundStyles = [tw.bgGreen200, tw.bgGray200];

/**
 * data [
 *    title
 *    value
 * ]
 */
export default function WidgetDetail02(props) {
  const { data } = props;

  const renderItem = ({ item, index }) => (
    <View style={[tw.flex1, tw.p2, tw.itemsCenter, backgroundStyles[index]]}>
      <RkText style={[tw.uppercase, tw.textCenter]}>{item.title}</RkText>
      <RkText rkType="bold" style={[tw.textXl, textStyles[index]]}>
        {item.value ? formatNumber(item.value) : 0}
      </RkText>
    </View>
  );

  const keyExtractor = (item, i) => `item-${i}`;

  return (
    <FlatList
      data={data}
      numColumns={2}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
}
