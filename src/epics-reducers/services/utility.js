import axios from "axios"
import {COMMON_APP, API, CONSTANTS} from "../../constants";

function getAllHcc(page, limit, query) {
  return axios.get(`${COMMON_APP.HOST_API}${API.HCC.format(page, limit, query)}`).then(res => {
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

function getHccDetail(_idHcc) {
  return axios.get(`${COMMON_APP.HOST_API}${API.HCC_DETAIL.format(_idHcc)}`).then(res => {
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

function getAllElictric(id) {
  return axios.get(`${COMMON_APP.HOST_API}${API.ELICTRIC.format(id)}`).then(res => {
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

function getElictricDetail(_id, inv) {
  return axios.get(`${COMMON_APP.HOST_API}${API.ELICTRIC_DETAIL.format(_id, inv)}`).then(res => {
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

export {getAllHcc, getHccDetail, getAllElictric, getElictricDetail}
