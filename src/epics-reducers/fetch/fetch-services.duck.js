import {createAction} from 'redux-actions';
import axios from 'axios';
import {Observable} from 'rxjs';

import {COMMON_APP, API, CONSTANTS} from "../../constants";

export const FETCH_SERVICES_REQUEST = 'FETCH_SERVICES_REQUEST';
export const FETCH_SERVICES_SUCCESS = 'FETCH_SERVICES_SUCCESS';
export const FETCH_SERVICES_FAILURE = 'FETCH_SERVICES_FAILURE';

export const fetchServicesRequest = createAction(FETCH_SERVICES_REQUEST);
export const fetchServicesSuccess = createAction(FETCH_SERVICES_SUCCESS);
export const fetchServicesFailure = createAction(FETCH_SERVICES_FAILURE);

export const fetchServicesEpic = (action, store) =>
  action.ofType(FETCH_SERVICES_REQUEST)
    .mergeMap(() => {
      return axios.get(`${COMMON_APP.HOST_API_PHAN_HOI}${API.SERVICE}`)
        .then(res => {
          if (res.data) {
            return fetchServicesSuccess(res.data);
          }
          else {
            return fetchServicesFailure(null)
          }
        })
        .catch(error => {
          return fetchServicesFailure(null)
        })
    });

export function fetchServicesReducer(servicesRes = null, action) {
  switch (action.type) {
    case FETCH_SERVICES_SUCCESS:
      return action.payload;
    case FETCH_SERVICES_FAILURE:
      return action.payload;
    default:
      return servicesRes;
  }
}
