import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getAll(page, limit, params) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.QUAN_LY_DU_LIEU_QUERY.format(page, limit)}`, { params })
    .then((res) => {
      if (res.data && res.data.docs) {
        return res.data.docs;
      } else {
        return null;
      }
      })
    .catch((error) => {
      return null;
    });
}

export function create(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.QUAN_LY_DU_LIEU}`, data)
    .then((res) => {
      if (res.data && res.data.docs) {
        return res.data.docs;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}