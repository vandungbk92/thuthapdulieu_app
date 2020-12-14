import {createAction} from "redux-actions";
import axios from "axios";
import {Observable} from "rxjs";

import {COMMON_APP, API, CONSTANTS} from "../../constants";
//import {API} from "../../common/api"
//import {CONSTANTS} from "../../common/constants";

export const FETCH_USERS_INFO_REQUEST = "FETCH_USERS_INFO_REQUEST";
export const FETCH_USERS_INFO_SUCCESS = "FETCH_USERS_INFO_SUCCESS";
export const FETCH_USERS_INFO_FAILURE = "FETCH_USERS_INFO_FAILURE";

export const fetchUsersInfoRequest = createAction(FETCH_USERS_INFO_REQUEST);
export const fetchUsersInfoSuccess = createAction(FETCH_USERS_INFO_SUCCESS);
export const fetchUsersInfoFailure = createAction(FETCH_USERS_INFO_FAILURE);

export const fetchUsersInfoEpic = (action, store) =>
  action.ofType(FETCH_USERS_INFO_REQUEST)
    .mergeMap(() => {
      return axios.get(`${COMMON_APP.HOST_API}${API.CITIZEN_ME}`)
        .then(res => {
          if (res.data) {
            return fetchUsersInfoSuccess(res.data);
          }
          else {
            return fetchUsersInfoFailure({})
          }
        })
        .catch(error => {
          return fetchUsersInfoFailure({})
        })
    });

export function fetchUsersInfoReducer(userInfoRes = {}, action) {
  switch (action.type) {
    case FETCH_USERS_INFO_SUCCESS:
      return action.payload;
    case FETCH_USERS_INFO_FAILURE:
      return action.payload;
    default:
      return userInfoRes;
  }
}
