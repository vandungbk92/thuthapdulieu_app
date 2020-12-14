import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getNguoikhai(citizenId) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.NCOVID_NGUOIKHAI.format(citizenId)}`)
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

export function updateNguoikhai(citizenId, data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.NCOVID_NGUOIKHAI.format(citizenId)}`, data)
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

export function getDanhmucKhaibao() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.NCOVID_DANHMUCKHAIBAO}`)
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

export function getDanhmucPhananh() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.NCOVID_DANHMUCPHANANH_QUERY.format(0, 0, '')}`)
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

export function khaibaoYte(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.NCOVID_KHAIBAO_YTE}`, data)
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

export function taomoiPhananh(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.NCOVID_PHANANH}`, data)
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

export function getFileNameVanBan(id, data) {
  return axios.post(`${COMMON_APP.HOST_API}${API.VAN_BAN.format(id)}`, {form: data}).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      return null
    })
}
