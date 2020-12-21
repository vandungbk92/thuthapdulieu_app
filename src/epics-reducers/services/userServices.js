import axios from 'axios';
import { COMMON_APP, API, CONSTANTS } from '../../constants';

export function userLogin(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.USERS_LOGIN}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return CONSTANTS.ERROR_AUTHEN;
    });
}

export function getUserInfo() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.USERS_ME}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function updateUserInfo(id, data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.USERS}/${id}`, data)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}
