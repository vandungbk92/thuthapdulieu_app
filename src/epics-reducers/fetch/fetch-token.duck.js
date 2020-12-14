import {createAction} from "redux-actions";
import {Observable} from "rxjs";

export const FETCH_TOKEN_DECODE = "FETCH_TOKEN_DECODE"
export const fetchTokenDecode = createAction(FETCH_TOKEN_DECODE)

export function fetchTokenReducer(tokenDecode = {}, action) {
  switch (action.type) {
    case FETCH_TOKEN_DECODE:
      return action.payload;
    default:
      return tokenDecode;
  }
}