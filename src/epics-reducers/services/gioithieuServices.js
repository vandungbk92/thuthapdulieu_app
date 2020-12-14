import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

function getAll(page, limit, query) {
  return axios.get(`${COMMON_APP.HOST_API}${API.GIOI_THIEU_QUERY}`).then(res => {
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



export {getAll}
