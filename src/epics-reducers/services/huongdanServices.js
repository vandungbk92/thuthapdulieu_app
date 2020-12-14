import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

function getAll(page, limit, query) {
  return axios.get(`${COMMON_APP.HOST_API}${API.HUONG_DAN_QUERY.format(page, limit, query)}`).then(res => {
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

function getById(id) {
  return axios.get(`${COMMON_APP.HOST_API}${API.HUONG_DAN_ID.format(id)}`).then(res => {
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

export {getById, getAll}
