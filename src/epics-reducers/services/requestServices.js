import {COMMON_APP, API, CONSTANTS} from "../../constants";
import axios from "axios";

function createRequest(data) {
  return axios.post(`${COMMON_APP.HOST_API_PHAN_HOI}${API.REQUEST_ME}`, data).then(res => {
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

function getAllRequest(page, limit, query) {
  let _limit = limit === 0 ? 0 : 10; query = query || ''
  return axios.get(`${COMMON_APP.HOST_API_PHAN_HOI}${API.REQUEST_QUERY.format(page, _limit, query)}`).then(res => {
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

function getRequestById(id) {
  return axios.get(`${COMMON_APP.HOST_API_PHAN_HOI}${API.REQUEST_ID.format(id)}`).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      return null
    })
}

function getMyRequests(page, limit, query, keyCrypt) {
  let _limit = limit === 0 ? 0 : 10; query = query || ''

  let url = `${COMMON_APP.HOST_API_PHAN_HOI}${API.REQUEST_ME_QUERY.format(page, _limit, query)}`
  const options = {
    method: 'GET',
    headers: { 'X-Custom-Header': keyCrypt }
  }

  return axios.get(url, options).then(res => {
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

function getMyRequestById(id, phone) {
  return axios.get(`${COMMON_APP.HOST_API_PHAN_HOI}${API.REQUEST_ME_ID.format(id)}`, {
    headers: { 'X-Custom-Header': phone }
  }).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      return null
    })
}

function updateMyRequestById(data) {
  let id = data._id
  delete data._id;
  delete data.__v;
  return axios.put(`${COMMON_APP.HOST_API}${API.REQUEST_ME_ID.format(id)}`, data).then(res => {
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
  getMyRequests,
  getRequestById,
  getMyRequestById,
  createRequest,
  getAllRequest,
  updateMyRequestById
}
