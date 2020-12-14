import { createAction } from "redux-actions";
import { Observable } from "rxjs";
import { COMMON_APP, API } from "../../constants";
import axios from 'axios'

export const FETCH_FAVORITE_REQUEST = "FETCH_FAVORITE_REQUEST";
export const FETCH_FAVORITE_SUCCESS = "FETCH_FAVORITE_SUCCESS";
export const FETCH_FAVORITE_FAILURE = "FETCH_FAVORITE_FAILURE";

export const fetchFavoriteRequest = createAction(FETCH_FAVORITE_REQUEST);
export const fetchFavoriteSuccess = createAction(FETCH_FAVORITE_SUCCESS);
export const fetchFavoriteFailure = createAction(FETCH_FAVORITE_FAILURE);

export const fetchFavoriteEpic = (action, store) =>
  action.ofType(FETCH_FAVORITE_REQUEST)
    .mergeMap(() => {
      return axios.get(`${COMMON_APP.HOST_API}${API.MY_FAVORYTE + store.getState().favoritedReq}`)
        .then(res => {
          if (res.data.docs) {
            return fetchFavoriteSuccess(res.data.docs);
          }
          else {
            return fetchFavoriteFailure([])
          }
        })
        .catch(error => {
          return fetchFavoriteFailure([])
        })
    });

export function requestFavoritedReducer(favoritedReq = {}, action) {
  switch (action.type) {
    case FETCH_FAVORITE_REQUEST:
      return action.payload;
    default:
      return favoritedReq;
  }
}

export function fetchFavoritedReducer(favorited = {}, action) {
  switch (action.type) {
    case FETCH_FAVORITE_SUCCESS:
      return action.payload;
    case FETCH_FAVORITE_FAILURE:
      return action.payload;
    default:
      return favorited;
  }
}


// export const FETCH_FAVORITED = "FETCH_FAVORITED"
// export const fetchFavorited = createAction(FETCH_FAVORITED)

// export function fetchFavoritedReducer(favorited = false, action) {
//   switch (action.type) {
//     case FETCH_FAVORITED:
//       return action.payload;
//     default:
//       return favorited;
//   }
// }