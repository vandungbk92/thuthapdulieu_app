import React from 'react';
import { connect } from 'react-redux';

import { tw } from 'react-native-tailwindcss';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, FlatList, ScrollView, TouchableOpacity } from 'react-native';

import I18n from '../../utilities/I18n';

import * as ROUTER from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

class ThongbaoCongdan extends React.Component {
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
          {I18n.t('Thông báo công dân')}
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
    if (route === ROUTER.HOPTHU_CONGDAN && !this.props.userInfoRes?._id) {
      this.props.navigation.navigate(ROUTER.LOGIN_PAGE);
      return;
    }
    this.props.navigation.navigate(route);
  };

  render() {
    return (
      <ScrollView style={[styleContainer.containerContent, tw.bgWhite]}>
        <FlatList
          data={[
            {
              icon: 'bell',
              title: 'THÔNG BÁO',
              router: ROUTER.THONG_BAO_PAGE,
              description: 'Thông báo, tin tức quan trọng',
            },
            {
              icon: 'newspaper',
              title: 'HỘP THƯ CÔNG DÂN',
              router: ROUTER.HOPTHU_CONGDAN,
              description: 'Hộp thư công dân',
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

function mapStateToProps(state) {
  const { userInfoRes } = state;
  return { userInfoRes };
}

export default connect(mapStateToProps)(ThongbaoCongdan);
