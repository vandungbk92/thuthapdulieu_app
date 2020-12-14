import { COMMON_APP, API } from "../../constants";

import axios from "axios"


function getAllCommentRequest(id) {
  return axios.get(`${COMMON_APP.HOST_API_PHAN_HOI}${API.COMMENT_BY_REQUEST.format(id)}`).then(res => {
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

function createComment(data) {
  return axios.post(`${COMMON_APP.HOST_API}${API.COMMENT}`, data).then(res => {
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

function updateComment(id, data) {
  return axios.put(`${COMMON_APP.HOST_API}${API.COMMENT_ID.format(id)}`, data).then(res => {
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

function delComment(id) {
  return axios.delete(`${COMMON_APP.HOST_API}${API.COMMENT_ID.format(id)}`).then(res => {
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

export { getAllCommentRequest, createComment, updateComment, delComment }
