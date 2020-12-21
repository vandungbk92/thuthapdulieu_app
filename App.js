import React from 'react';
import { Platform, StatusBar, StyleSheet, View, BackHandler } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';
import AppNavigator from './src/navigation/AppNavigator';
import { bootstrap } from "./config/bootstrap";
import { extendFunction } from "./config/extendFunction";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux"
import { createEpicMiddleware } from "redux-observable"
import { composeWithDevTools } from "redux-devtools-extension"
import rootReducer from "./src/epics-reducers/rootReducer"
import rootEpic from "./src/epics-reducers/rootEpic"
import { CONSTANTS } from "./src/constants/constants";
import I18n, { I18nProvider } from "./src/utilities/I18n";
import IsLoading from './src/screens/base/IsLoading/IsLoading'

const epicMiddleware = createEpicMiddleware(rootEpic);
const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(epicMiddleware)),
);

bootstrap();
extendFunction(store);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  _loadResourcesAsync = async () => {
    return Promise.all([
      I18n.init(),
      Asset.loadAsync([
        CONSTANTS.LOGO,
        CONSTANTS.LOGO_HOME,
        CONSTANTS.IMAGE_PROFILE,
        CONSTANTS.ICON_CREATE_NEW,
        CONSTANTS.ICON_MY_SELF,
        CONSTANTS.ICON_RECENT,
        CONSTANTS.ICON_FAVORITE,
        CONSTANTS.ICON_INTRODUCE,
        CONSTANTS.ICON_USER,
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
            <AppNavigator />
            <IsLoading />
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
