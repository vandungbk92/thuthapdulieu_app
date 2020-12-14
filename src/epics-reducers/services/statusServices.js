import axios from "axios"
import {COMMON_APP, API, CONSTANTS} from "../../constants";


function getStatus() {
  return axios.get(`${COMMON_APP.HOST_API}${API.SETTINGS}`);
}

export {getStatus}