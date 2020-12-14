import React from 'react';
import { Platform, StatusBar, StyleSheet, View, BackHandler } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { NavigationActions } from 'react-navigation';
import AppNavigator from './src/navigation/AppNavigator';
import { bootstrap } from "./config/bootstrap";
import { extendFunction } from "./config/extendFunction";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux"
import { createEpicMiddleware } from "redux-observable"
import { composeWithDevTools } from "redux-devtools-extension"
import rootReducer from "./src/epics-reducers/rootReducer"
import rootEpic from "./src/epics-reducers/rootEpic"
import { fetchSettingRequest } from './src/epics-reducers/fetch/fetch-setting.duck';
import { CONSTANTS } from "./src/constants/constants";
import { CHI_TIET_THONG_BAO_PAGE, HOPTHU_CONGDAN_DETAIL } from './src/constants/router';
import I18n, { I18nProvider } from "./src/utilities/I18n";
import IsLoading from './src/screens/base/IsLoading/IsLoading'
import * as PushNotify from './src/utilities/PushNotify'
import { tw } from 'react-native-tailwindcss';
import { RkText } from 'react-native-ui-kitten';
import NotificationPopup from 'react-native-push-notification-popup';
import { getById as getThongbaoById } from './src/epics-reducers/services/thongbaoService';
import { getById as getHopThuById } from './src/epics-reducers/services/hopthucongdanServices';

const epicMiddleware = createEpicMiddleware(rootEpic);
const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(epicMiddleware)),
);

bootstrap();
extendFunction(store);

PushNotify.createChannel();

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  async componentWillMount() {
    await PushNotify.registerPushNotify();
    this.onPushNotify();

    store.dispatch(fetchSettingRequest());
  }

  componentWillUnmount() {
    this.notificationListener?.remove();
  }

  onPushNotify() {
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      const { title, body, data } = notification.request.content;
      this.notificationPopup?.show({ title, body, onPress: async () => {
        if (data && data._id) {
          if (data.type) {
            const hopthuData = await getHopThuById(data._id);
            this.navigation.dispatch(
              NavigationActions.navigate({
                routeName: HOPTHU_CONGDAN_DETAIL,
                params: hopthuData,
              }),
            );
          } else {
            const thongbaoData = await getThongbaoById(data._id);
            this.navigation.dispatch(
              NavigationActions.navigate({
                routeName: CHI_TIET_THONG_BAO_PAGE,
                params: { info_detail: thongbaoData },
              }),
            );
          }
        }
      }});
    });
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      I18n.init(),
      Asset.loadAsync([
        CONSTANTS.LOGO_CREATE_NEW,
        CONSTANTS.LOGO_MY_SELF,
        CONSTANTS.LOGO_RECENT,
        CONSTANTS.LOGO_FAVORITE,
        CONSTANTS.LOGO_INTRODUCE,
        CONSTANTS.LOGO_USER,
        CONSTANTS.IMAGE_DEFAULT_SMALL,
        CONSTANTS.IMAGE_DEFAULT_LARGE,
        CONSTANTS.CAMERA,
        CONSTANTS.LOGOx68PNG,
        CONSTANTS.IMAGE_PROFILE,
        CONSTANTS.LOGO_LOGIN,
        CONSTANTS.LOGO_LOOKUP_RECORDS,
        CONSTANTS.LOGO_LOOKUP_INVOICES,
        CONSTANTS.BG_PHAN_ANH_SCREEN,
        CONSTANTS.BG_HOME_SCREEN,
        CONSTANTS.WORLD_MAP,
        CONSTANTS.IMAGE_CITY,
        CONSTANTS.WEATHER_1,
        CONSTANTS.WEATHER_2,
        CONSTANTS.WEATHER_3,
        CONSTANTS.WEATHER_4,
        CONSTANTS.WEATHER_5,
        CONSTANTS.WEATHER_10,
        CONSTANTS.WEATHER_11,
        CONSTANTS.LOGO_HOME
      ]),
      Font.loadAsync({
        SVN_Raleway_Bold: require("./assets/fonts/Roboto-Bold.ttf"),
        SVN_Raleway_Light: require("./assets/fonts/Roboto-Light.ttf"),
        SVN_Raleway_Regular: require("./assets/fonts/Roboto-Regular.ttf"),
        ...Icon.Entypo.font,
        ...Icon.Ionicons.font,
        ...Icon.FontAwesome.font,
        ...Icon.FontAwesome5.font,
        ...Icon.MaterialCommunityIcons.font
      }),
    ]);
  };

  _handleLoadingError = error => {
    /* console.log(error, 'errorerror')
    showToast('Ứng dụng khởi động không thành công, vui lòng thử lại sau')
    setTimeout(function () {
      BackHandler.exitApp()
    }, 2000); */
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }

    return (
      <Provider store={store}>
        <I18nProvider i18n={I18n.getInstance()}>
          <View style={styles.container}>
            <IsLoading />
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator ref={c => (this.navigation = c)} />
            <IsLoading />
            <NotificationPopup
              ref={c => (this.notificationPopup = c)}
              renderPopupContent={({ title, body }) => (
                <View style={[tw.pX4, tw.pY2, tw.shadow, tw.bgWhite, tw.roundedLg, { minHeight: 86 }]}>
                  <RkText rkType="bold">{title}</RkText>
                  <RkText numberOfLines={3}>{body}</RkText>
                </View>
              )}
            />
          </View>
        </I18nProvider>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
