import React from 'react';

import moment from 'moment';

import { tw } from 'react-native-tailwindcss';

import { View } from 'react-native';

import { RkText } from 'react-native-ui-kitten';

export default function WidgetTime(props) {
  const { value } = props;

  return (
    <View style={[tw.flexRow, tw.pY2, tw.justifyBetween]}>
      <RkText style={tw.textSm}>
        {`Cập nhật lúc ${moment(value).format('HH[h]mm, DD/MM')}`}
      </RkText>
    </View>
  );
}
