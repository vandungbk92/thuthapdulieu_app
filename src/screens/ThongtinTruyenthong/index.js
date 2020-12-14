import React from 'react';
import { View, FlatList, ScrollView, TouchableOpacity } from 'react-native';

import { tw } from 'react-native-tailwindcss';

import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { RkText } from 'react-native-ui-kitten';

import I18n from '../../utilities/I18n';

import * as ROUTER from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

export default class ThongtinTruyenthong extends React.Component {
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
          {I18n.t('Thông tin truyền thông')}
        </RkText>
      ),
    };
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[tw.flexRow, tw.p2, tw.rounded, tw.bgWhite]}
        onPress={this.navigateItem(item.router)}
      >
        <View style={[tw.w12, tw.pT1, tw.itemsCenter]}>
          <FontAwesome5
            name={item.icon}
            size={26}
            solid={true}
            color={KittenTheme.colors.appColor}
          />
        </View>
        <View style={[tw.flex1, tw.pL1]}>
          <RkText rkType="bold" style={{ color: KittenTheme.colors.appColor }}>
            {item.title}
          </RkText>
          <RkText style={[tw.textSm, { color: KittenTheme.colors.blueGray }]}>
            {item.description}
          </RkText>
        </View>
      </TouchableOpacity>
    );
  };

  navigateItem = (route) => () => {
    this.props.navigation.navigate(route);
  };

  render() {
    return (
      <ScrollView style={[styleContainer.containerContent, tw.bgWhite]}>
        <FlatList
          data={[
            {
              icon: 'newspaper',
              title: 'THÔNG TIN SAI LỆCH',
              router: ROUTER.THONGTIN_SAILECH,
              description: 'Thông tin sai lệch',
            },
            {
              icon: 'searchengin',
              title: 'XÁC MINH THÔNG TIN',
              router: ROUTER.XACMINH_THONGTIN,
              description: 'Xác minh thông tin',
            },
          ]}
          renderItem={this.renderItem}
          keyExtractor={(item, i) => `item-${i}`}
          contentContainerStyle={[tw.pT2]}
          ItemSeparatorComponent={() => (
            <View style={[tw.mL16, tw.hPx, tw.bgGray300, tw.mY1]} />
          )}
        />
      </ScrollView>
    );
  }
}
