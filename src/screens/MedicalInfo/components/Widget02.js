import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { View, FlatList } from 'react-native';

import { RkText } from 'react-native-ui-kitten';

import WidgetDetail02 from './WidgetDetail02';

import { formatNumber } from '../../../helper/numberFormat';

/**
 * data [
 *    title
 *    value
 *    note
 *    detail [
 *       title
 *       value
 *    ]
 * ]
 */
export default function Widget02(props) {
  const { data } = props;

  const renderItem = ({ item }) => (
    <View style={[tw.rounded, tw.overflowHidden]}>
      <View style={[tw.p2, tw.itemsCenter, tw.bgRed200]}>
        <RkText style={[tw.uppercase, tw.textCenter]}>{item.title}</RkText>
        <RkText rkType="bold" style={[tw.textXl, tw.textRed500]}>
          {item.value ? formatNumber(item.value) : 0}
        </RkText>
        {item.note && (
          <RkText style={[tw.textSm, tw.textCenter]}>{item.note}</RkText>
        )}
      </View>
      <WidgetDetail02 data={item.detail} />
    </View>
  );

  const keyExtractor = (item, i) => `widget-${i}`;

  const ItemSeparatorComponent = () => <View style={tw.h2} />;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
}
