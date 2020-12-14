import {createAction} from 'redux-actions';
import axios from 'axios';
import {COMMON_APP, API} from "../../constants";

export const FETCH_UNITS_REQUEST = 'FETCH_UNITS_REQUEST';
export const FETCH_UNITS_SUCCESS = 'FETCH_UNITS_SUCCESS';
export const FETCH_UNITS_FAILURE = 'FETCH_UNITS_FAILURE';

export const fetchUnitsRequest = createAction(FETCH_UNITS_REQUEST);
export const fetchUnitsSuccess = createAction(FETCH_UNITS_SUCCESS);
export const fetchUnitsFailure = createAction(FETCH_UNITS_FAILURE);

export const fetchUnitsEpic = (action, store) =>
  action.ofType(FETCH_UNITS_REQUEST)
    .mergeMap(() => {
      return axios.get(`${COMMON_APP.HOST_API_PHAN_HOI}${API.UNIT}`)
        .then(res => {
          if (res.data) {
            return fetchUnitsSuccess(res.data);
          }
          else {
            return fetchUnitsFailure(null)
          }
        })
        .catch(error => {
          return fetchUnitsFailure(null)
        })
    });

export function fetchUnitsReducer(unitsRes = null, action) {
  switch (action.type) {
    case FETCH_UNITS_SUCCESS:
      return action.payload;
    case FETCH_UNITS_FAILURE:
      return action.payload;
    default:
      return unitsRes;
  }
}
