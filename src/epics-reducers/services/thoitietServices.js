import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getThoitiet() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.THOI_TIET}`)
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
