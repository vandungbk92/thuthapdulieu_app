import React from 'react';

import { FontAwesome5 } from '@expo/vector-icons';

import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import {
  APP_NAVIGATOR,
  LOGIN_PAGE,
  HOME_PAGE,
  PROFILE_PAGE,
  IMAGE_BROWSER_PAGE,
  VIEW_IMAGE_PAGE,
  NOISOI_TAI,
  NOISOI_TAI_FILTER,
  NOISOI_TAI_DETAIL,
  NOISOI_TAI_CREATE,
  NOISOI_MUI,
  NOISOI_MUI_DETAIL,
  NOISOI_MUI_CREATE,
  NOISOI_HONG,
  NOISOI_HONG_DETAIL,
  NOISOI_HONG_CREATE,
  CHUPANH_DA,
  CHUPANH_DA_DETAIL,
  CHUPANH_DA_CREATE,
  NGHE_PHOI,
  NGHE_PHOI_DETAIL,
  NGHE_PHOI_CREATE,
} from '../constants/router';

import { KittenTheme } from '../../config/theme';

import LoginScreen from '../screens/Login';
import HomeScreen from '../screens/Home';
import UserProfileScreen from '../screens/UserProfile';

import ImageBrowserScreen from '../screens/ImageBrowser';
import ViewImageScreen from '../screens/base/viewImages';

import NoisoiTai from '../screens/NoisoiTai';
import NoisoiTaiFilter from '../screens/NoisoiTai/Filter';
import NoisoiTaiDetail from '../screens/NoisoiTai/Detail';
import NoisoiTaiCreate from '../screens/NoisoiTai/Create';

import NoisoiMui from '../screens/NoisoiMui';
import NoisoiMuiDetail from '../screens/NoisoiMui/Detail';
import NoisoiMuiCreate from '../screens/NoisoiMui/Create';

import NoisoiHong from '../screens/NoisoiHong';
import NoisoiHongDetail from '../screens/NoisoiHong/Detail';
import NoisoiHongCreate from '../screens/NoisoiHong/Create';

import ChupanhDa from '../screens/ChupanhDa';
import ChupanhDaDetail from '../screens/ChupanhDa/Detail';
import ChupanhDaCreate from '../screens/ChupanhDa/Create';

import NghePhoi from '../screens/NghePhoi';
import NghePhoiDetail from '../screens/NghePhoi/Detail';
import NghePhoiCreate from '../screens/NghePhoi/Create';

const TabNavigator = createBottomTabNavigator(
  {
    [HOME_PAGE]: {
      screen: createStackNavigator(
        {
          [HOME_PAGE]: HomeScreen,
        },
        {
          defaultNavigationOptions: {
            headerTitleAlign: 'center',
          },
        },
      ),
      navigationOptions: {
        title: 'Trang chủ',
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name="home" size={18} solid={true} color={tintColor} />
        ),
      },
    },
    [PROFILE_PAGE]: {
      screen: createStackNavigator(
        {
          [PROFILE_PAGE]: UserProfileScreen,
        },
        {
          defaultNavigationOptions: {
            headerTitleAlign: 'center',
          },
        },
      ),
      navigationOptions: {
        title: 'Tài khoản',
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name="user" size={18} solid={true} color={tintColor} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: KittenTheme.colors.appColor,
    },
  },
);

const AppNavigator = createStackNavigator(
  {
    TabNavigator: {
      screen: TabNavigator,
      navigationOptions: {
        headerShown: false,
      },
    },

    [HOME_PAGE]: HomeScreen,
    [PROFILE_PAGE]: UserProfileScreen,

    [IMAGE_BROWSER_PAGE]: ImageBrowserScreen,
    [VIEW_IMAGE_PAGE]: ViewImageScreen,

    [NOISOI_TAI]: NoisoiTai,
    [NOISOI_TAI_FILTER]: NoisoiTaiFilter,
    [NOISOI_TAI_DETAIL]: NoisoiTaiDetail,
    [NOISOI_TAI_CREATE]: NoisoiTaiCreate,

    [NOISOI_MUI]: NoisoiMui,
    [NOISOI_MUI_DETAIL]: NoisoiMuiDetail,
    [NOISOI_MUI_CREATE]: NoisoiMuiCreate,

    [NOISOI_HONG]: NoisoiHong,
    [NOISOI_HONG_DETAIL]: NoisoiHongDetail,
    [NOISOI_HONG_CREATE]: NoisoiHongCreate,

    [CHUPANH_DA]: ChupanhDa,
    [CHUPANH_DA_DETAIL]: ChupanhDaDetail,
    [CHUPANH_DA_CREATE]: ChupanhDaCreate,

    [NGHE_PHOI]: NghePhoi,
    [NGHE_PHOI_DETAIL]: NghePhoiDetail,
    [NGHE_PHOI_CREATE]: NghePhoiCreate,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      headerTitleAlign: 'center',
    },
  },
);

const MainTabNavigator = createStackNavigator(
  {
    [LOGIN_PAGE]: LoginScreen,
    [APP_NAVIGATOR]: AppNavigator,
  },
  {
    headerMode: 'none',
  },
);

export default MainTabNavigator;
