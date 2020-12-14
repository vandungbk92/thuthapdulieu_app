import {COMMON_APP, API, CONSTANTS} from "../../constants";
import axios from "axios"

function createFavorited(data) {
  return axios.post(`${COMMON_APP.HOST_API}${API.MY_FAVORYTE}`, data).then(res => {
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

function getAllFavorired(page, limit, query) {
  let _limit = limit === 0 ? 0 : 10; query = query || ''
  return axios.get(`${COMMON_APP.HOST_API}${API.MY_FAVORYTE_QUERY.format(page, _limit, query)}`).then(res => {
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

function deleteFavorired(id) {
    return axios.delete(`${COMMON_APP.HOST_API}${API.MY_FAVORYTE_ID.format(id)}`).then(res => {
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

export {
    createFavorited,
    getAllFavorired,
    deleteFavorired
}