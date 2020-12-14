import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import {
  CREATE_REQUEST_PAGE,
  MY_REQUESTS_PAGE,
  REQUESTS_PAGE,
  MY_FAVORITED_PAGE,
  NOTIFICATIONS_PAGE,
  PROFILE_PAGE,
  LOGIN_PAGE,
  REQUEST_DETAIL_PAGE,
  SEARCH_PAGE,
  HOME_PAGE,
  IMAGE_BROWSER_PAGE,
  VIEW_IMAGE_PAGE,
  UTILITIES_PAGE,
  RECORD_DETAIL_PAGE,
  INVOICE_DETAIL_PAGE,
  LOOKUP_RECORDS_PAGE,
  LOOKUP_INVOICES_PAGE,
  COVID_PAGE,
  MEDICAL_INFO,
  MEDICAL_CONTACT,
  MEDICAL_ADDRESS,
  MEDICAL_ADDRESS_MAP,
  MEDICAL_DOCUMENT,
  MEDICAL_QUESTION,
  MEDICAL_REFLECTION,
  MEDICAL_NEWS,
  MEDICAL_NEWS_DETAIL,
  PHAN_HOI_PAGE,
  THONG_BAO_PAGE,
  CHI_TIET_THONG_BAO_PAGE,
  SU_KIEN_VAN_HOA,
  CHI_TIET_SU_KIEN_VAN_HOA,
  WEATHER_PAGE,
  CHI_TIET_VAN_BAN_PAGE,
  GIOI_THIEU,
  ANTOAN_THONGTIN,
  TIN_TUC,
  CHI_TIET_TIN_TUC_PAGE,
  CANH_BAO,
  CHI_TIET_CANH_BAO_PAGE,
  HUONG_DAN,
  CHI_TIET_HUONG_DAN_PAGE,
  HOI_DAP_PAGE,
  DS_HOI_DAP_PAGE,
  CHI_TIET_HOI_DAP_PAGE,
  TAILIEU_TUYENTRUYEN,
  DICHBENH_THANHHOA,
  THONGTIN_DICHTE_STACK,
  THONGTIN_DICHTE,
  THONGTIN_DICHTE_FILTER,
  THONGTIN_TRUYENTHONG,
  XACMINH_THONGTIN,
  XACMINH_THONGTIN_CREATE,
  XACMINH_THONGTIN_DETAIL,
  XACMINH_THONGTIN_FILTER,
  THONGTIN_SAILECH,
  THONGTIN_SAILECH_DETAIL,
  THONGTIN_SAILECH_FILTER,
  THONGBAO_CONGDAN,
  HOPTHU_CONGDAN,
  HOPTHU_CONGDAN_DETAIL,
} from '../constants/router';

import HomeScreen from '../screens/Home';
import LoginScreen from '../screens/Login';
import NotificationsScreen from '../screens/Notifications';
import UserProfileScreen from '../screens/UserProfile';
import RequestsScreen from '../screens/Requests';
import SearchScreen from '../screens/Search';
import MyFavouritesScreen from '../screens/MyFavorites';
import SelectCategoryScreen from '../screens/SelectCategory';
import CreateRequestScreen from '../screens/CreateRequest';
import ImageBrowserScreen from '../screens/ImageBrowser';
import ViewImageScreen from '../screens/base/viewImages';
import RequestScreen from '../screens/Request';
import MyRequestsScreen from '../screens/MyRequests';
import CovidScreen from '../screens/Covid';
import MedicalInfoScreen from '../screens/MedicalInfo';
import MedicalContactScreen from '../screens/MedicalContact';
import MedicalAddressScreen from '../screens/MedicalAddress';
import MedicalAddressMapScreen from '../screens/MedicalAddressMap';
import MedicalDocumentScreen from '../screens/MedicalDocument';
import MedicalQuestionScreen from '../screens/MedicalQuestion';
import MedicalReflectionScreen from '../screens/MedicalReflection';
import MedicalNewsScreen from '../screens/MedicalNews';
import MedicalNewsDetailScreen from '../screens/MedicalNewsDetail';
import PhanHoiThanhHoaScreen from '../screens/PhanHoiThanhHoa';
import ThongBaoScreen from '../screens/ThongBao/ThongBao';
import ThongBaoDetailScreen from '../screens/ThongBao/ThongBaoDetail';
import SuKienVanHoaScreen from '../screens/SuKienVanHoa';
import ChiTietSuKienVanHoaScreen from '../screens/SuKienVanHoa/SuKienVanHoa';
import WeatherPage from '../screens/Weather';
import ChiTietVanBanPage from '../screens/MedicalDocument/ChiTietVanBan';
import GioiThieuPage from '../screens/GioiThieu/GioiThieu';
import AnToanThongTinPage from '../screens/AnToanThongTin'
import TinTuc from '../screens/TinTuc/TinTuc';
import TinTucDetail from '../screens/TinTuc/TinTucDetail';
import CanhBao from '../screens/CanhBao/CanhBao';
import CanhBaoDetail from '../screens/CanhBao/CanhBaoDetail';
import HuongDan from '../screens/HuongDan/HuongDan';
import HuongDanDetail from '../screens/HuongDan/HuongDanDetail';
import HoiDap from '../screens/HoiDap';
import DsHoiDap from '../screens/HoiDap/DsHoiDap';
import ChiTietHoiDap from '../screens/HoiDap/ChiTiet';
import TaiLieuTuyenTruyen from '../screens/TaiLieuTuyenTruyen';
import DichbenhThanhHoa from '../screens/DichbenhThanhHoa';
import ThongtinDichte from '../screens/ThongtinDichte';
import ThongtinDichteFilter from '../screens/ThongtinDichte/SearchFilter';
import ThongtinTruyenthong from '../screens/ThongtinTruyenthong';
import XacminhThongtin from '../screens/XacminhThongtin';
import XacminhThongtinCreate from '../screens/XacminhThongtin/Create';
import XacminhThongtinDetail from '../screens/XacminhThongtin/Detail';
import XacminhThongtinFilter from '../screens/XacminhThongtin/Filter';
import ThongtinSailech from '../screens/ThongtinSailech';
import ThongtinSailechDetail from '../screens/ThongtinSailech/Detail';
import ThongtinSailechFilter from '../screens/ThongtinSailech/Filter';
import ThongbaoCongdan from '../screens/ThongbaoCongdan';
import HopthuCongdan from '../screens/HopthuCongdan';
import HopthuCongdanDetail from '../screens/HopthuCongdan/Detail';

import { KittenTheme } from '../../config/theme';

// useScreens();

const TabNavigator = createBottomTabNavigator(
  {
    [HOME_PAGE]: {
      screen: createStackNavigator({
        [HOME_PAGE]: HomeScreen,
      }, {
        defaultNavigationOptions: {
          headerTitleAlign: 'center',
        },
      }),
      navigationOptions: {
        title: 'Trang chủ',
        tabBarIcon: ({ tintColor }) => <FontAwesome5 name="home" size={18} solid={true} color={tintColor} />
      }
    },
    [COVID_PAGE]: {
      screen: createStackNavigator({
        [COVID_PAGE]: CovidScreen,
      }, {
        defaultNavigationOptions: {
          headerTitleAlign: 'center',
        },
      }),
      navigationOptions: {
        title: 'Covid-19',
        tabBarIcon: ({ tintColor }) => <FontAwesome5 name="file-medical-alt" size={18} solid={true} color={tintColor} />
      }
    },
    [CREATE_REQUEST_PAGE]: {
      screen: createStackNavigator({
        [CREATE_REQUEST_PAGE]: MedicalReflectionScreen,
      }, {
        defaultNavigationOptions: {
          headerTitleAlign: 'center',
        },
      }),
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <View style={[tw.w10, tw.h10, tw.roundedFull, tw.itemsCenter, tw.justifyCenter, { backgroundColor: KittenTheme.colors.appColor } ]}>
            <FontAwesome5 name="plus" size={18} solid={true} color="white" />
          </View>
        ),
        tabBarLabel: () => null,
      }
    },
    [THONGBAO_CONGDAN]: {
      screen: createStackNavigator({
        [THONGBAO_CONGDAN]: ThongbaoCongdan,
      }, {
        defaultNavigationOptions: {
          headerTitleAlign: 'center',
        },
      }),
      navigationOptions: {
        title: 'Thông báo',
        tabBarIcon: ({ tintColor }) => <FontAwesome5 name="bell" size={18} solid={true} color={tintColor} />
      }
    },
    [PROFILE_PAGE]: {
      screen: createStackNavigator({
        [PROFILE_PAGE]: UserProfileScreen,
      }, {
        defaultNavigationOptions: {
          headerTitleAlign: 'center',
        },
      }),
      navigationOptions: {
        title: 'Tài khoản',
        tabBarIcon: ({ tintColor }) => <FontAwesome5 name="user" size={18} solid={true} color={tintColor} />
      }
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
    [PHAN_HOI_PAGE]: PhanHoiThanhHoaScreen,
    [NOTIFICATIONS_PAGE]: NotificationsScreen,
    [PROFILE_PAGE]: UserProfileScreen,
    [REQUESTS_PAGE]: RequestsScreen,
    [SEARCH_PAGE]: SearchScreen,

    // MyFavourites
    [MY_FAVORITED_PAGE]: MyFavouritesScreen,

    // CreateRequest
    [CREATE_REQUEST_PAGE]: CreateRequestScreen,

    [IMAGE_BROWSER_PAGE]: ImageBrowserScreen,
    [VIEW_IMAGE_PAGE]: ViewImageScreen,

    // Request
    [REQUEST_DETAIL_PAGE]: RequestScreen,

    // MyRequests
    [MY_REQUESTS_PAGE]: MyRequestsScreen,

    [COVID_PAGE]: CovidScreen,
    [MEDICAL_INFO]: MedicalInfoScreen,
    [MEDICAL_CONTACT]: MedicalContactScreen,
    [MEDICAL_DOCUMENT]: MedicalDocumentScreen,
    [MEDICAL_QUESTION]: MedicalQuestionScreen,
    [MEDICAL_REFLECTION]: MedicalReflectionScreen,

    [MEDICAL_NEWS]: MedicalNewsScreen,
    [MEDICAL_NEWS_DETAIL]: MedicalNewsDetailScreen,

    [MEDICAL_ADDRESS]: MedicalAddressScreen,
    [MEDICAL_ADDRESS_MAP]: MedicalAddressMapScreen,

    [SU_KIEN_VAN_HOA]: SuKienVanHoaScreen,
    [CHI_TIET_SU_KIEN_VAN_HOA]: ChiTietSuKienVanHoaScreen,

    [WEATHER_PAGE]: WeatherPage,
    [CHI_TIET_VAN_BAN_PAGE]: ChiTietVanBanPage,
    [GIOI_THIEU]: GioiThieuPage,

    [ANTOAN_THONGTIN]:AnToanThongTinPage,
    [TIN_TUC]:TinTuc,
    [CHI_TIET_TIN_TUC_PAGE]:TinTucDetail,
    [CANH_BAO]:CanhBao,
    [CHI_TIET_CANH_BAO_PAGE]:CanhBaoDetail,
    [HUONG_DAN]:HuongDan,
    [CHI_TIET_HUONG_DAN_PAGE]:HuongDanDetail,
    [HOI_DAP_PAGE]:HoiDap,
    [DS_HOI_DAP_PAGE]:DsHoiDap,
    [CHI_TIET_HOI_DAP_PAGE]:ChiTietHoiDap,
    [TAILIEU_TUYENTRUYEN]: TaiLieuTuyenTruyen,
    [DICHBENH_THANHHOA]:DichbenhThanhHoa,
    [THONGTIN_DICHTE_STACK]: {
      screen: createStackNavigator({
        [THONGTIN_DICHTE]: ThongtinDichte,
        [THONGTIN_DICHTE_FILTER]: ThongtinDichteFilter,
      }, {
        mode: 'modal',
        headerMode: 'screen',
        defaultNavigationOptions: {
          headerTitleAlign: 'center',
        },
        initialRouteName: THONGTIN_DICHTE_FILTER,
      }),
      navigationOptions: {
        headerShown: false,
      },
    },

    // Thông tin truyền thông
    [THONGTIN_TRUYENTHONG]: ThongtinTruyenthong,
    [XACMINH_THONGTIN]: XacminhThongtin,
    [XACMINH_THONGTIN_CREATE]: XacminhThongtinCreate,
    [XACMINH_THONGTIN_DETAIL]: XacminhThongtinDetail,
    [XACMINH_THONGTIN_FILTER]: XacminhThongtinFilter,
    [THONGTIN_SAILECH]: ThongtinSailech,
    [THONGTIN_SAILECH_DETAIL]: ThongtinSailechDetail,
    [THONGTIN_SAILECH_FILTER]: ThongtinSailechFilter,

    // Thông báo công dân
    [THONGBAO_CONGDAN]: ThongbaoCongdan,
    [THONG_BAO_PAGE]: ThongBaoScreen,
    [CHI_TIET_THONG_BAO_PAGE]: ThongBaoDetailScreen,
    [HOPTHU_CONGDAN]: HopthuCongdan,
    [HOPTHU_CONGDAN_DETAIL]: HopthuCongdanDetail,
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
    AppNavigator,
    [LOGIN_PAGE]: LoginScreen,
  },
  {
    headerMode: 'none',
  },
);

export default MainTabNavigator;
