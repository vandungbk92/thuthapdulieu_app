import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getTinhthanh() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.TINHTHANH_QUERY.format(0, 0, '')}`)
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

export function getQuanhuyenByTinhthanh(thinhthanhId) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.QUANHUYEN_BY_TINHTHANH.format(thinhthanhId)}`)
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

export function getPhuongxaByQuanhuyen(quanhuyenId) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.PHUONGXA_BY_QUANHUYEN.format(quanhuyenId)}`)
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
