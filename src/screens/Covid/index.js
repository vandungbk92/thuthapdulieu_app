import React from 'react';
import {
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { tw, color } from 'react-native-tailwindcss';

import * as WebBrowser from 'expo-web-browser';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { RkText } from 'react-native-ui-kitten';

import I18n from '../../utilities/I18n';
import { CONSTANTS } from '../../constants';
import { SCREEN_HEIGHT } from '../../constants/variable';

import * as ROUTER from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

export default class Covid extends React.Component {
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
          {I18n.t('Dịch bệnh Covid-19')}
        </RkText>
      ),
    };
  };

  state = {
    items: [
      {
        icon: 'chart-line',
        title: 'THÔNG TIN DỊCH BỆNH',
        router: ROUTER.MEDICAL_INFO,
        description: 'Cập nhật thông tin mới về dịch bệnh Covid-19',
        backgroundStyle: tw.bgTeal500,
      },
      {
        icon: 'history',
        title: 'THÔNG TIN DỊCH TỄ',
        router: ROUTER.THONGTIN_DICHTE_STACK,
        description: 'Thông tin dịch tễ về các bệnh nhân Covid-19',
        backgroundStyle: tw.bgTeal500,
      },
      {
        icon: 'file-alt',
        title: 'TỜ KHAI Y TẾ',
        router: () => WebBrowser.openBrowserAsync('https://tokhaiyte.vn'),
        description: 'Hệ thống thông tin quản lý khai bao y tế',
        backgroundStyle: tw.bgTeal500,
      },
      {
        icon: 'phone-volume',
        title: 'PHẢN ÁNH NGƯỜI DÂN',
        router: ROUTER.MEDICAL_REFLECTION,
        description: 'Người dân phản ánh thông tin về dịch bệnh Covid-19',
        backgroundStyle: tw.bgPurple500,
      },
      {
        icon: 'notes-medical',
        title: 'VĂN BẢN CHỈ ĐẠO',
        router: ROUTER.MEDICAL_DOCUMENT,
        description:
          'Tổng hợp các văn bản chỉ đạo về phòng, chống dịch Covid-19',
        backgroundStyle: tw.bgGreen500,
      },
      {
        icon: 'notes-medical',
        title: 'TÀI LIỆU TUYÊN TRUYỀN',
        router: ROUTER.TAILIEU_TUYENTRUYEN,
        description:
          'Tổng hợp tin bài, video tuyên truyền về dịch bệnh Covid-19',
        backgroundStyle: tw.bgGreen500,
      },
      {
        icon: 'file-medical-alt',
        title: 'TIN TỨC Y TẾ',
        router: ROUTER.MEDICAL_NEWS,
        description: 'Tổng hợp tin tức về dịch bệnh Covid-19',
        backgroundStyle: tw.bgOrange500,
      },
      {
        icon: 'fax',
        title: 'DANH BẠ KHẨN CẤP',
        router: ROUTER.MEDICAL_CONTACT,
        description:
          'Danh sách danh bạ khẩn cấp phục vụ cho dịch bệnh Covid-19',
        backgroundStyle: tw.bgBlue500,
      },
      {
        icon: 'hospital',
        title: 'CƠ SỞ Y TẾ',
        router: ROUTER.MEDICAL_ADDRESS,
        description: 'Danh sách cơ sở y tế phục vụ cho dịch bệnh Covid-19',
        backgroundStyle: tw.bgRed500,
      },
      {
        icon: 'question-circle',
        title: 'HỎI ĐÁP',
        router: ROUTER.MEDICAL_QUESTION,
        description: 'Tổng hợp các câu hỏi về dịch bệnh Covid-19',
        backgroundStyle: tw.bgGray500,
      },
    ],
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

    /*return (
      <TouchableOpacity
        style={[tw.flexRow, tw.p2, tw.rounded, item.backgroundStyle]}
        onPress={this.navigateItem(item.router)}
      >
        <View style={[tw.w12, tw.pT1, tw.itemsCenter]}>
          <FontAwesome5
            name={item.icon}
            size={32}
            solid={true}
            color={KittenTheme.colors.white}
          />
        </View>
        <View style={[tw.flex1, tw.pL1]}>
          <RkText rkType="bold" style={tw.textWhite}>
            {item.title}
          </RkText>
          <RkText style={[tw.textSm, tw.textWhite]}>{item.description}</RkText>
        </View>
      </TouchableOpacity>
    )*/
  };

  navigateItem = (route) => () => {
    if (typeof route === 'function') {
      route();
    } else {
      this.props.navigation.navigate(route);
    }
  };

  render() {
    return (
      <ScrollView style={[styleContainer.containerContent, tw.bgWhite]}>
        <View style={{ height: SCREEN_HEIGHT / 4 }}>
          <Image
            style={[tw.wFull, tw.hFull]}
            source={CONSTANTS.WORLD_MAP}
            resizeMode={'stretch'}
          />
        </View>
        <FlatList
          data={this.state.items}
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
