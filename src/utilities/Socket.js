import io from 'socket.io-client';

import { COMMON_APP } from '../constants';

const DEBUG = false;

const log = (...args) => DEBUG && console.log('[DEBUG]', ...args);

const options = {
  transports: ['polling', 'websocket'],
  autoConnect: false
};
const Socket = io(COMMON_APP.HOST_API, options);

Socket.on('connect', () => log('connected'));

Socket.on('connect_error', error => log('connect_error', error));

Socket.on('connect_timeout', timeout => log('connect_timeout', timeout));

Socket.on('error', error => log('error', error));

Socket.on('disconnect', reason => log('disconnect', reason));

Socket.on('reconnect', attemptNumber => log('reconnect', attemptNumber));

Socket.on('reconnect_attempt', attemptNumber => log('reconnect_attempt', attemptNumber));

Socket.on('reconnecting', attemptNumber => log('reconnecting', attemptNumber));

Socket.on('reconnect_error', error => log('reconnect_error', error));

Socket.on('reconnect_failed', () => log('reconnect_failed'));

Socket.on('citizen_notify', data => log('citizen_notify', data));

Socket.on('citizen_push_notify', data => log('citizen_push_notify', data));

Socket.on('citizen_delete_notify', data => log('citizen_delete_notify', data));

Socket.on('citizen_read_notify_yn', data => log('citizen_read_notify_yn', data));

Socket.on('citizen_all_notify_yn', data => log('citizen_all_notify_yn', data));

export default Socket;
