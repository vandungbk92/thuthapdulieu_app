import axios from "axios"
import {COMMON_APP, API, CONSTANTS} from "../../constants";


function registerAccout(data) {
  return axios.post(`${COMMON_APP.HOST_API}${API.CITIZEN_REGISTER}`, data).then(res => {
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

function userLogin(data) {
  return axios.post(`${COMMON_APP.HOST_API}${API.CITIZEN_LOGIN}`, data).then(res => {
    if (res.data) {
      return res.data;
    }
    else {
      return null
    }
  })
    .catch(error => {
      return CONSTANTS.ERROR_AUTHEN
    });
}

function getUserInfo() {
  return axios.get(`${COMMON_APP.HOST_API}${API.CITIZEN_ME}`).then(res => {
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

function updateUserInfo(data) {
  return axios.put(`${COMMON_APP.HOST_API}${API.CITIZEN_INFO}`, data).then(res => {
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

function forgotPasswordMail(email) {
  return axios.post(`${COMMON_APP.HOST_API}${API.CITIZEN_FORGOT_PASSWORD}`, email).then(res => {
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

function loginFacebook(data, dispatch) {
  return axios.post(`${COMMON_APP.HOST_API}${API.CITIZEN_LOGIN_FACEBOOK}`, data).then(res => {
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

function loginGoogle(data, dispatch) {
  return axios.post(`${COMMON_APP.HOST_API}${API.CITIZEN_LOGIN_GOOGLE}`, data).then(res => {
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

export {registerAccout, userLogin, getUserInfo, updateUserInfo, forgotPasswordMail, loginFacebook, loginGoogle}