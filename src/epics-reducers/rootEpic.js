import { combineEpics } from 'redux-observable';

import { fetchLoginEpic } from './fetch/fetch-login.duck';
import { fetchUsersInfoEpic } from './fetch/fetch-users-info.duck';

const rootEpic = combineEpics(fetchLoginEpic, fetchUsersInfoEpic);

export default rootEpic;
