import axios from "axios"
import {COMMON_APP, API, CONSTANTS} from "../../constants";

function getAllDistrict() {
  return axios.get(`${COMMON_APP.HOST_API}${API.DISTRICT}`).then(res => {
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

export {getAllDistrict}