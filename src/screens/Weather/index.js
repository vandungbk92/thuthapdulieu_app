import React from 'react';

import moment from 'moment';

import { tw } from 'react-native-tailwindcss';

import { View, Image, FlatList, TouchableOpacity } from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';

import I18n from '../../utilities/I18n';

import { getThoitiet } from '../../epics-reducers/services/thoitietServices';

import icon01 from '../../../assets/images/1.png';
import icon02 from '../../../assets/images/2.png';
import icon03 from '../../../assets/images/3.png';
import icon04 from '../../../assets/images/4.png';
import icon05 from '../../../assets/images/5.png';
import icon10 from '../../../assets/images/10.png';
import icon11 from '../../../assets/images/11.png';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

export default class WeatherPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => navigation.goBack(null)}
        >
          <Ionicons
            name="ios-arrow-back"
            size={20}
            color={KittenTheme.colors.primaryText}
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>
          {I18n.t('Thời tiết Thanh Hóa')}
        </RkText>
      ),
    };
  };

  state = {
    thoitiet: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const thoitiet = await getThoitiet();
    this.setState({ thoitiet });
  };

  getWeekday = (date) => {
    const d = new Date(date);
    const now = new Date();

    const days = [
      'Chủ nhật',
      'Thứ hai',
      'Thứ ba',
      'Thứ tư',
      'Thứ năm',
      'Thứ sáu',
      'Thứ bảy',
    ];

    if (d.getDay() === now.getDay()) {
      return 'Hôm nay';
    }
    return days[d.getDay()];
  };

  getWeatherIcon = (icon, mode) => {
    let weatherIcon = icon01;

    if (mode === 'day') {
      if ([1, 2].includes(icon)) weatherIcon = icon01;
      if ([3, 4, 5, 6].includes(icon)) weatherIcon = icon02;
      if ([7, 8, 11].includes(icon)) weatherIcon = icon03;
      if ([12, 13, 14, 18].includes(icon)) weatherIcon = icon04;
      if ([15, 16, 17].includes(icon)) weatherIcon = icon05;
    } else {
      if ([33, 34].includes(icon)) weatherIcon = icon10;
      if ([35, 36, 37, 38].includes(icon)) weatherIcon = icon11;
      if ([7, 8, 11].includes(icon)) weatherIcon = icon03;
      if ([12, 13, 14, 18].includes(icon)) weatherIcon = icon04;
    }

    return weatherIcon;
  };

  renderItem = ({ item }) => {
    return (
      <View style={[tw.flexRow, tw.rounded, tw.overflowHidden]}>
        <View style={[tw.flex1, tw.p2, tw.bgBlue500, tw.justifyEnd]}>
          <View
            style={[
              tw.p1,
              tw.rounded,
              tw.selfStart,
              { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
            ]}
          >
            <RkText style={tw.textWhite}>
              {`${this.getWeekday(item.Date)}, ${moment(item.Date).format('DD/MM')}`}
            </RkText>
          </View>
          <View style={tw.itemsCenter}>
            <Image
              style={[tw.mY2, tw.w12, tw.h12]}
              source={this.getWeatherIcon(item.Day.Icon, 'day')}
            />
            <RkText style={tw.textWhite}>{item.Day.IconPhrase}</RkText>
            <RkText style={[tw.textWhite, tw.textLg]}>
              {`${item.Temperature.Maximum.Value} °${item.Temperature.Maximum.Unit}`}
            </RkText>
          </View>
        </View>
        <View style={[tw.flex1, tw.p2, tw.bgGray900, tw.justifyEnd]}>
          <View style={tw.itemsCenter}>
            <Image
              style={[tw.mY2, tw.w12, tw.h12]}
              source={this.getWeatherIcon(item.Night.Icon)}
            />
            <RkText style={tw.textWhite}>{item.Night.IconPhrase}</RkText>
            <RkText style={[tw.textWhite, tw.textLg]}>
              {`${item.Temperature.Minimum.Value} °${item.Temperature.Minimum.Unit}`}
            </RkText>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <FlatList
        data={this.state.thoitiet}
        renderItem={this.renderItem}
        keyExtractor={(item, i) => `item-${i}`}
        ItemSeparatorComponent={() => <View style={tw.h4} />}
        contentContainerStyle={tw.p4}
      />
    );
  }
}
