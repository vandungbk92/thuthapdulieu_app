import {createAction} from "redux-actions";
import axios from "axios";
import {COMMON_APP, API, CONSTANTS} from "../../constants";
import * as PushNotify from '../../utilities/PushNotify';

export const FETCH_SETTING_REQUEST = "FETCH_SETTING_REQUEST";
export const FETCH_SETTING_SUCCESS = "FETCH_SETTING_SUCCESS";
export const FETCH_SETTING_FAILURE = "FETCH_SETTING_FAILURE";

export const fetchSettingRequest = createAction(FETCH_SETTING_REQUEST);
export const fetchSettingSuccess = createAction(FETCH_SETTING_SUCCESS);
export const fetchSettingFailure = createAction(FETCH_SETTING_FAILURE);

export const fetchSettingEpic = (action, store) =>
  action.ofType(FETCH_SETTING_REQUEST)
    .mergeMap(() => {
      let deviceToken = PushNotify.getDeviceToken()
      let url = `${COMMON_APP.HOST_API}${API.SETTINGS}`
      if(deviceToken){
        url += '?device_token=' + deviceToken
      }
      return axios.get(url)
        .then(res => {
          if (res.data) {
            return fetchSettingSuccess(res.data);
          }
          else {
            return fetchSettingFailure(CONSTANTS.SETTING)
          }
        })
        .catch(error => {
          return fetchSettingFailure(CONSTANTS.SETTING)
        })
    });

export function fetchSettingReducer(setting = {}, action) {
  switch (action.type) {
    case FETCH_SETTING_SUCCESS:
      return action.payload;
    case FETCH_SETTING_FAILURE:
      return action.payload;
    default:
      return setting;
  }
}


// fetch aboutApp
export const FETCH_ABOUT_APP_REQUEST = "FETCH_ABOUT_APP_REQUEST";
export const FETCH_ABOUT_APP_SUCCESS = "FETCH_ABOUT_APP_SUCCESS";
export const FETCH_ABOUT_APP_FAILURE = "FETCH_ABOUT_APP_FAILURE";

export const fetchAboutAppRequest = createAction(FETCH_ABOUT_APP_REQUEST);
export const fetchAboutAppSuccess = createAction(FETCH_ABOUT_APP_SUCCESS);
export const fetchAboutAppFailure = createAction(FETCH_ABOUT_APP_FAILURE);

export const fetchAboutAppEpic = (action, store) =>
  action.ofType(FETCH_ABOUT_APP_REQUEST)
    .mergeMap(() => {
      return axios.get(`${COMMON_APP.HOST_API}${API.ABOUT_APP.format('infoApp')}`)
        .then(res => {
          if (res.data) {
            if(Array.isArray(res.data) && res.data.length){
              return fetchAboutAppSuccess(res.data[0]);
            }
            else{
              return fetchAboutAppSuccess(null);
            }
          }
          else {
            return fetchAboutAppFailure(null)
          }
        })
        .catch(error => {
          return fetchAboutAppFailure(null)
        })
    });

export function fetchAboutAppReducer(setting = null, action) {
  switch (action.type) {
    case FETCH_ABOUT_APP_SUCCESS:
      return action.payload;
    case FETCH_ABOUT_APP_FAILURE:
      return action.payload;
    default:
      return setting;
  }
}
