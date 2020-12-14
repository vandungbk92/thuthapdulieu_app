import {createAction} from 'redux-actions';
import axios from 'axios';
import {Observable} from 'rxjs';

import {COMMON_APP, API, CONSTANTS} from "../../constants";

export const FETCH_DISTRICTS_REQUEST = 'FETCH_DISTRICTS_REQUEST';
export const FETCH_DISTRICTS_SUCCESS = 'FETCH_DISTRICTS_SUCCESS';
export const FETCH_DISTRICTS_FAILURE = 'FETCH_DISTRICTS_FAILURE';

export const fetchDistrictsRequest = createAction(FETCH_DISTRICTS_REQUEST);
export const fetchDistrictsSuccess = createAction(FETCH_DISTRICTS_SUCCESS);
export const fetchDistrictsFailure = createAction(FETCH_DISTRICTS_FAILURE);

export const fetchDistrictsEpic = (action, store) =>
  action.ofType(FETCH_DISTRICTS_REQUEST)
    .mergeMap(() => {
      return axios.get(`${COMMON_APP.HOST_API}${API.DISTRICT}`)
        .then(res => {
          if (res.data) {
            return fetchDistrictsSuccess(res.data);
          }
          else {
            return fetchDistrictsFailure(null)
          }
        })
        .catch(error => {
          return fetchDistrictsFailure(null)
        })
    });

export function fetchDistrictsReducer(districtsRes = null, action) {
  switch (action.type) {
    case FETCH_DISTRICTS_SUCCESS:
      return action.payload;
    case FETCH_DISTRICTS_FAILURE:
      return action.payload;
    default:
      return districtsRes;
  }
}
