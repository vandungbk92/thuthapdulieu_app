import React from 'react';
import { View, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';

import { tw, color } from 'react-native-tailwindcss';

import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { RkText } from 'react-native-ui-kitten';

import I18n from '../../utilities/I18n';
import { CONSTANTS } from '../../constants';
import { SCREEN_HEIGHT } from "../../constants/variable";

import * as ROUTER from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';
import {connect} from "react-redux";

class AnToanThongTin extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
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
      headerTitle: (
        <RkText rkType="header4" style={styleContainer.headerTitle}>
          {I18n.t('An Toàn Thông Tin')}
        </RkText>
      ),
    };
  };


  renderItem = ({ item }) => {
    return <TouchableOpacity
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
        <RkText rkType="bold" style={{color: KittenTheme.colors.appColor}}>
          {item.title}
        </RkText>
        <RkText style={[tw.textSm, {color:  KittenTheme.colors.blueGray}]}>{item.description}</RkText>
      </View>
    </TouchableOpacity>
  }

  navigateItem = (route) => () => {
    this.props.navigation.navigate(route);
  };

  render() {
    let {userInfoRes} = this.props
    return (
      <ScrollView style={[styleContainer.containerContent, tw.bgWhite]}>
        <FlatList
          data={[
            {
              icon: 'newspaper',
              title: 'TIN TỨC',
              router: ROUTER.TIN_TUC,
              description: 'Tin tức về an toàn thông tin',
              backgroundStyle: tw.bgPurple500,
            },

            {
              icon: 'file-alt',
              title: 'CẢNH BÁO',
              router: ROUTER.CANH_BAO,
              description: 'Những cảnh báo cần lưu ý',
              backgroundStyle: tw.bgTeal500,
            },

            {
              icon: 'file-signature',
              title: 'HƯỚNG DẪN',
              router: ROUTER.HUONG_DAN,
              description:
                'Tổng hợp các hướng dẫn về an toàn thông tin',
              backgroundStyle: tw.bgGreen500,
            },

            {
              icon: 'question-circle',
              title: 'HỎI ĐÁP',
              router: userInfoRes && userInfoRes._id ? ROUTER.DS_HOI_DAP_PAGE : ROUTER.LOGIN_PAGE,
              description: 'Hỏi đáp về an toàn thông tin',
              backgroundStyle: tw.bgGreen500,
            }
          ]}
          renderItem={this.renderItem}
          keyExtractor={(item, i) => `item-${i}`}
          contentContainerStyle={[tw.pT2]}
          ItemSeparatorComponent={() => <View style={[tw.mL16, tw.hPx, tw.bgGray300, tw.mY1]} />}
        />
      </ScrollView>
    );
  }
}
function mapStateToProps(state) {
  const {setting, userInfoRes} = state
  return {setting, userInfoRes}
}

export default connect(mapStateToProps)(AnToanThongTin);
