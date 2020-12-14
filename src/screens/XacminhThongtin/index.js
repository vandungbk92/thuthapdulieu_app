import React from 'react';
import { connect } from 'react-redux';

import { tw } from 'react-native-tailwindcss';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, TouchableOpacity } from 'react-native';

import { FloatingAction } from 'react-native-floating-action';
import { TabView, SceneMap, TabBar, TabBarItem } from 'react-native-tab-view';

import I18n from '../../utilities/I18n';

import {
  LOGIN_PAGE,
  XACMINH_THONGTIN_CREATE,
  XACMINH_THONGTIN_FILTER,
} from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import ListTab from './ListTab';
import MyselfTab from './MyselfTab';

class XacminhThongtin extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      params: { forceRefresh: true },
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
          {I18n.t('Xác minh thông tin')}
        </RkText>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => {
            navigation.setParams({ forceRefresh: false });
            navigation.navigate(XACMINH_THONGTIN_FILTER, params);
          }}
        >
          <MaterialCommunityIcons
            name="filter-outline"
            size={20}
            color={KittenTheme.colors.primaryText}
          />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };
  }

  handleTabChange = (tabIndex) => {
    if (tabIndex === 1 && !this.props.userInfoRes?._id) {
      this.props.navigation.navigate(LOGIN_PAGE);
      return;
    }
    this.setState({ tabIndex });
  };

  render() {
    return (
      <View style={styleContainer.containerContent}>
        <TabView
          lazy
          renderTabBar={(tabBarProps) => (
            <TabBar
              {...tabBarProps}
              style={[
                tw.m4,
                tw.pPx,
                tw.border,
                tw.bgWhite,
                tw.roundedLg,
                tw.shadowNone,
                { borderColor: KittenTheme.colors.appColor },
              ]}
              labelStyle={tw.fontBold}
              inactiveColor={KittenTheme.colors.primaryText}
              getLabelText={({ route }) => route.title}
              indicatorStyle={{ height: 0 }}
              renderTabBarItem={(tabBarItemProps) => {
                const { route, navigationState } = tabBarItemProps;

                const tabIndex = navigationState.routes.indexOf(route);
                const isFocused = navigationState.index === tabIndex;

                return (
                  <TabBarItem
                    {...tabBarItemProps}
                    style={
                      isFocused && [
                        tw.roundedLg,
                        { backgroundColor: KittenTheme.colors.appColor },
                      ]
                    }
                  />
                );
              }}
            />
          )}
          navigationState={{
            index: this.state.tabIndex,
            routes: [
              { key: 'list', title: 'Tất cả' },
              { key: 'myself', title: 'Của tôi' },
            ],
          }}
          renderScene={SceneMap({
            list: ListTab,
            myself: MyselfTab,
          })}
          onIndexChange={this.handleTabChange}
        />
        <View style={[tw.absolute, tw.p4, tw.bottom0, tw.right0]}>
          <TouchableOpacity
            style={[
              tw.flexRow,
              tw.p3,
              tw.w40,
              tw.roundedFull,
              tw.itemsCenter,
              tw.justifyCenter,
              { backgroundColor: KittenTheme.colors.appColor },
            ]}
            onPress={() => {
              if (this.props.userInfoRes && this.props.userInfoRes._id) {
                this.props.navigation.navigate(XACMINH_THONGTIN_CREATE);
              } else {
                this.props.navigation.navigate(LOGIN_PAGE);
              }
            }}
          >
            <Ionicons
              name="ios-add"
              size={26}
              color={KittenTheme.colors.white}
            />
            <View style={tw.w2} />
            <RkText rkType="bold" style={tw.textWhite}>
              Gửi yêu cầu
            </RkText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { userInfoRes } = state;
  return { userInfoRes };
}

export default connect(mapStateToProps)(XacminhThongtin);
