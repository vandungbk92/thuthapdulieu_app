import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getBenh() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.BENH_QUERY.format(0, 0, '')}`)
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

export function getTrieuchung() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.TRIEUCHUNG_QUERY.format(0, 0, '')}`)
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
