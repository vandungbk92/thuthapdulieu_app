import axios from 'axios';

import { API, COMMON_APP } from '../../constants';

/**
 * Get list notifications
 */
export function getNotifications(createdAt) {
  return axios
    .get(`${COMMON_APP.HOST_API}${API.CITIZEN_NOTIFY.format(1, 10, createdAt)}`)
    .then(response => {
      if (response.data) {
        return response.data;
      }
      return null;
    });
}
