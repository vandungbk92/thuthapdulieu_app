import axios from "axios"
import {COMMON_APP, API, CONSTANTS} from "../../constants";


function getAllFaqs() {
  return axios.get(`${COMMON_APP.HOST_API}${API.FAQS}`).then(res => {
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

export {getAllFaqs}