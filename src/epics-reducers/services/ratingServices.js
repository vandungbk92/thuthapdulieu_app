import axios from "axios"
import {COMMON_APP, API, CONSTANTS} from "../../constants";


function getAllRatingByRequest(id) {
  return axios.get(`${COMMON_APP.HOST_API_PHAN_HOI}${API.RATING_BY_REQUEST.format(id)}`).then(res => {
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

function getMyRatingByRequest(id) {
  return axios.get(`${COMMON_APP.HOST_API}${API.MY_RATING_BY_REQUEST.format(id)}`).then(res => {
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

function createRating(data) {
  return axios.post(`${COMMON_APP.HOST_API}${API.RATING}`, data).then(res => {
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

function updateRating(data) {
  let id = data._id
  delete data._id;
  delete data.__v;
  return axios.put(`${COMMON_APP.HOST_API}${API.RATING_ID.format(id)}`, data).then(res => {
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

export {createRating, updateRating, getAllRatingByRequest, getMyRatingByRequest}
