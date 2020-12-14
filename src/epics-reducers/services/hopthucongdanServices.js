import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getAll(page, limit, params) {
  return axios
    .get(
      `${COMMON_APP.HOST_API}${API.HOPTHU_CONGDAN_QUERY.format(page, limit, '')}`,
      { params },
    )
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

export function getById(id) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.HOPTHU_CONGDAN_ID.format(id)}`)
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

export function updateViewYn(id) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.HOPTHU_CONGDAN_ID.format(id)}`)
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
