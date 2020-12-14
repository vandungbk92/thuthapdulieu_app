import axios from "axios";
import { COMMON_APP, API } from '../../constants';

function getAll(page, limit, query) {
  return axios.get(`${COMMON_APP.HOST_API}${API.HOLIDAY_QUERY.format(page, limit, query ? query : '')}`).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      console.log(error)
      return null
    });
}

export {getAll}
