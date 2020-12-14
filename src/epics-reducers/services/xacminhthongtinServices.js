import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getAll(page, limit, params) {
  return axios
    .get(
      `${COMMON_APP.HOST_API}${API.XACMINH_THONGTIN_QUERY.format(
        page,
        limit,
        '',
      )}`,
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

export function getOne(id) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.XACMINH_THONGTIN_ID.format(id)}`)
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

export function getMyself(page, limit, params) {
  return axios
    .get(
      `${COMMON_APP.HOST_API}${API.XACMINH_THONGTIN_CUATOI_QUERY.format(
        page,
        limit,
        '',
      )}`,
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

export function createRequest(data) {
  return axios
    .post(`${COMMON_APP.HOST_API}${API.XACMINH_THONGTIN}`, data)
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

export function updateRequest(id, data) {
  return axios
    .put(`${COMMON_APP.HOST_API}${API.BOSUNG_THONGTIN_ID.format(id)}`, data)
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
