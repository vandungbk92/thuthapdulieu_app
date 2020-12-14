import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { View } from 'react-native';

import { RkText } from 'react-native-ui-kitten';

import WidgetItem01 from './WidgetItem01';

/**
 * data {
 *    cases
 *    deaths
 *    recovered
 *    todayCases
 *    todayDeaths
 * }
 */
export default function Widget01(props) {
  const { data, containerStyle } = props;

  return (
    <View style={[tw.flexRow, containerStyle]}>
      <WidgetItem01
        title="Nhiễm bệnh"
        total={data.cases}
        today={data.todayCases}
        containerStyle={tw.bgOrange500}
      />
      <View style={tw.w2} />
      <WidgetItem01
        title="Tử vong"
        total={data.deaths}
        today={data.todayDeaths}
        containerStyle={tw.bgRed500}
      />
      <View style={tw.w2} />
      <WidgetItem01
        title="Bình phục"
        total={data.recovered}
        hideToday={true}
        containerStyle={tw.bgGreen500}
      />
    </View>
  );
}
