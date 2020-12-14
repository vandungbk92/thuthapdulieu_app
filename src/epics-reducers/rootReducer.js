import { combineReducers } from "redux";

import { requestLoginReducer, fetchLoginReducer } from "./fetch/fetch-login.duck";
import { fetchTokenReducer } from "./fetch/fetch-token.duck"
import { fetchUsersInfoReducer } from "./fetch/fetch-users-info.duck";
import { fetchFavoritedReducer, requestFavoritedReducer } from './fetch/fetch-favorited.duck'
import { fetchSettingReducer, fetchAboutAppReducer } from "./fetch/fetch-setting.duck";

import { fetchServicesReducer } from './fetch/fetch-services.duck';
import { fetchDistrictsReducer } from './fetch/fetch-district.duck';
import {fetchLoadingReducer} from "./fetch/fetch-loading.duck";
import { fetchUnitsReducer } from './fetch/fetch-units.duck';
import { notificationReducer } from './fetch/fetch-notifications.duck';


const rootReducer = combineReducers({
  loginReq: requestLoginReducer,
  loginRes: fetchLoginReducer,
  setting: fetchSettingReducer,
  aboutApp: fetchAboutAppReducer,
  userInfoRes: fetchUsersInfoReducer,
  tokenDecode: fetchTokenReducer,
  favoritedReq: requestFavoritedReducer,
  favorited: fetchFavoritedReducer,
  servicesRes: fetchServicesReducer,
  districtsRes: fetchDistrictsReducer,
  isLoading: fetchLoadingReducer,
  unitsRes: fetchUnitsReducer,
  notification: notificationReducer
});

export default rootReducer;
