import { COMMON_APP, API } from "../../constants";

import axios from "axios"


function getCountCitizens() {
  return axios.get(`${COMMON_APP.HOST_API}${API.COUNT}`).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      return null
    });
}

function getListMyPoint(id, page, limit) {
  page = page || 1, limit = limit || 0
  return axios.get(`${COMMON_APP.HOST_API}${API.LIST_MY_POINT_ID.format(id, page, limit)}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  })
    .catch(error => {
      return null;
    });
}

function getAllGifts(id, page, limit) {
  return axios.get(`${COMMON_APP.HOST_API}${API.GIFTS.format(id)}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  })
    .catch(error => {
      return null;
    });
}

function getMyGifts(id, page, limit) {
  page = page || 1, limit = limit || 0
  return axios.get(`${COMMON_APP.HOST_API}${API.MY_GIFTS.format(id, page, limit)}`).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  })
    .catch(error => {
      return null;
    });
}


function redeemGift(citizen_id, data) {
  return axios.post(`${COMMON_APP.HOST_API}${API.REDEEM.format(citizen_id)}`, data).then(res => {
    if (res.data) {
      return res.data;
    } else {
      return null;
    }
  })
    .catch(error => {
      return null;
    });
}


export { getCountCitizens, getListMyPoint, getAllGifts, getMyGifts, redeemGift }