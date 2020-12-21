import { combineReducers } from "redux";

import { requestLoginReducer, fetchLoginReducer } from "./fetch/fetch-login.duck";
import { fetchTokenReducer } from "./fetch/fetch-token.duck"
import { fetchUsersInfoReducer } from "./fetch/fetch-users-info.duck";

import { fetchLoadingReducer } from "./fetch/fetch-loading.duck";

const rootReducer = combineReducers({
  loginReq: requestLoginReducer,
  loginRes: fetchLoginReducer,
  userInfoRes: fetchUsersInfoReducer,
  tokenDecode: fetchTokenReducer,
  isLoading: fetchLoadingReducer,
});

export default rootReducer;
