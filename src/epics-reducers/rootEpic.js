import {combineEpics} from "redux-observable";
import {fetchLoginEpic, fetchLogoutEpic} from "./fetch/fetch-login.duck";
import {fetchUsersInfoEpic} from "./fetch/fetch-users-info.duck";
import {fetchSettingEpic, fetchAboutAppEpic} from "./fetch/fetch-setting.duck"
import { fetchFavoriteEpic } from "./fetch/fetch-favorited.duck";

import { fetchServicesEpic } from './fetch/fetch-services.duck';
import { fetchDistrictsEpic } from './fetch/fetch-district.duck';
import { fetchUnitsEpic } from './fetch/fetch-units.duck';

const rootEpic = combineEpics(
  fetchLoginEpic,
  fetchLogoutEpic,
  fetchUsersInfoEpic,
  fetchSettingEpic,
  fetchAboutAppEpic,
  fetchFavoriteEpic,
  // services
  fetchServicesEpic,
  // district
  fetchDistrictsEpic,
  fetchUnitsEpic
)

export default rootEpic;
