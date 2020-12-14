import {COMMON_APP, API, CONSTANTS} from "../../constants";

import axios from "axios"


function getAllServices() {
  return axios.get(`${COMMON_APP.HOST_API}${API.SERVICE}`).then(res => {
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
  ;
}


export {getAllServices}