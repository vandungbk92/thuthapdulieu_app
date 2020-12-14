import axios from "axios"
import {COMMON_APP, API, CONSTANTS} from "../../constants";

function getRequestByDistrict(districts, time) {
  time = time ||''
  return axios.get(`${COMMON_APP.HOST_API}${API.REPORT}${API.REQUEST_BY_DISTRICT.format(districts, time)}`,).then(res => {
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

function getRequestByServices(time) {
  time = time ||''
  return axios.get(`${COMMON_APP.HOST_API}${API.REPORT}${API.REQUEST_BY_SERVICE.format(time)}`).then(res => {
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

function getRequestByMe() {
  return axios.get(`${COMMON_APP.HOST_API}${API.REPORT}${API.REQUEST_BY_ME}`).then(res => {
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


export {getRequestByDistrict, getRequestByServices, getRequestByMe}