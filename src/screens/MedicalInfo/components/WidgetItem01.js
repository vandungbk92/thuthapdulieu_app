import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { View } from 'react-native';

import { RkText } from 'react-native-ui-kitten';

import { formatNumber } from '../../../helper/numberFormat';

export default function WidgetItem01(props) {
  const { title, total, today, hideToday, containerStyle } = props;

  return (
    <View style={[tw.flex1, tw.p1, tw.rounded, containerStyle]}>
      <RkText rkType="bold" style={[tw.textSm, tw.textWhite]}>
        {total ? formatNumber(total) : 0}
      </RkText>
      <RkText rkType="bold" style={[tw.pYPx, tw.textWhite]}>
        {title}
      </RkText>
      {!hideToday && (
        <RkText style={[tw.textSm, tw.textWhite]}>
          {`+${today ? formatNumber(today) : 0}`}
        </RkText>
      )}
    </View>
  );
}
