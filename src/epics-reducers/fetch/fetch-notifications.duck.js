import produce from 'immer';
import { createAction } from 'redux-actions';

import * as PushNotify from '../../utilities/PushNotify';

export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
export const READ_NOTIFICATION_SUCCESS = 'READ_NOTIFICATION_SUCCESS';
export const FETCH_NOTIFICATIONS_SUCCESS = 'FETCH_NOTIFICATIONS_SUCCESS';
export const REMOVE_NOTIFICATION_SUCCESS = 'REMOVE_NOTIFICATION_SUCCESS';
export const RECEIVE_NOTIFICATION_SUCCESS = 'RECEIVE_NOTIFICATION_SUCCESS';
export const ADD_MORE_NOTIFICATIONS_SUCCESS = 'ADD_MORE_NOTIFICATIONS_SUCCESS';
export const READ_ALL_NOTIFICATIONS_SUCCESS = 'READ_ALL_NOTIFICATIONS_SUCCESS';

export const clearNotifications = createAction(
  CLEAR_NOTIFICATIONS
);
export const readNotificationSuccess = createAction(
  READ_NOTIFICATION_SUCCESS
);
export const fetchNotificationsSuccess = createAction(
  FETCH_NOTIFICATIONS_SUCCESS
);
export const removeNotificationSuccess = createAction(
  REMOVE_NOTIFICATION_SUCCESS
);
export const receiveNotificationSuccess = createAction(
  RECEIVE_NOTIFICATION_SUCCESS
);
export const addMoreNotificationsSuccess = createAction(
  ADD_MORE_NOTIFICATIONS_SUCCESS
);
export const readAllNotificationsSuccess = createAction(
  READ_ALL_NOTIFICATIONS_SUCCESS
);

export const initialState = {
  data: [],
  count: 0
};

export const notificationReducer = produce((draft, action) => {
  switch (action.type) {
    case CLEAR_NOTIFICATIONS: {
      draft.data = [];
      draft.count = 0;
      PushNotify.setBadgeNumber(draft.count);
      break;
    }

    case READ_NOTIFICATION_SUCCESS: {
      const foundIndex = draft.data.findIndex(
        item => item._id === action.payload._id
      );
      if (foundIndex !== -1) {
        if (draft.data[foundIndex].viewYn !== action.payload.viewYn) {
            if (action.payload.viewYn) {
            draft.count -= 1;
          } else {
            draft.count += 1;
          }
          PushNotify.setBadgeNumber(draft.count);
        }

        draft.data[foundIndex].viewYn = action.payload.viewYn;
      }
      break;
    }

    case FETCH_NOTIFICATIONS_SUCCESS: {
      draft.data = action.payload.content;
      draft.count = action.payload.count;
      PushNotify.setBadgeNumber(draft.count);
      break;
    }

    case REMOVE_NOTIFICATION_SUCCESS: {
      const foundIndex = draft.data.findIndex(
        item => item._id === action.payload._id
      );
      if (foundIndex !== -1) {
        if (!action.payload.viewYn) {
          draft.count -= 1;
          PushNotify.setBadgeNumber(draft.count);
        }
        draft.data.splice(foundIndex, 1);
      }
      break;
    }

    case RECEIVE_NOTIFICATION_SUCCESS: {
      if (!action.payload.viewYn) {
        draft.count += 1;
        PushNotify.setBadgeNumber(draft.count);
      }
      draft.data.unshift(action.payload);
      break;
    }

    case ADD_MORE_NOTIFICATIONS_SUCCESS: {
      draft.data = draft.data.concat(action.payload);
      break;
    }

    case READ_ALL_NOTIFICATIONS_SUCCESS: {
      if (action.payload.ok) {
        draft.data = draft.data.map(item => ({
          ...item,
          viewYn: true
        }));
        draft.count = 0;
        PushNotify.setBadgeNumber(draft.count);
      }
      break;
    }
  }
}, initialState);
