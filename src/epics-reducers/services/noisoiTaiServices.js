import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getAll(page, limit, params) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.NOISOI_TAI_QUERY.format(page, limit, '')}`, { params })
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

export function createData(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.NOISOI_TAI}`, data)
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
