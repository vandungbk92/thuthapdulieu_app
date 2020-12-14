import axios from 'axios';
import { COMMON_APP, API } from '../../constants';

export function getAll() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.NCOVID}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function getVietnam() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.NCOVID_VIETNAM}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function getThanhHoa() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.NCOVID_THANHHOA}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function getListNews(page) {
  return axios
    .get(
      `${COMMON_APP.HOST_API}${API.NCOVID_TINTUC_QUERY.format(page, 10, '')}`,
    )
    .then((res) => {
      if (res.data) {
        return { docs: res.data };
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function getAllContact() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.NCOVID_DANHBA_QUERY.format(0, 0, '')}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function getAllAddress() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.NCOVID_COSOYTE_QUERY.format(0, 0, '')}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function getAllCSYTByDanhMuc() {
  return axios
    .get(
      `${COMMON_APP.HOST_API}${API.NCOVID_COSOYTE_ID.format(
        'phan-loai-danh-muc',
      )}`,
    )
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function getAllFaqs() {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.NCOVID_FAQS_QUERY.format(0, 0, '')}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}

export function getThongtinDichte(page, params) {
  return axios
    .get(
      `${COMMON_APP.HOST_API}${API.THONGTIN_DICHTE_QUERY.format(page, 10, '')}`,
      { params },
    )
    .then((res) => {
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((error) => {
      return null;
    });
}
