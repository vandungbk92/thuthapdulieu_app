import React from 'react';
import { View } from 'react-native';

import moment from 'moment';

import FormGroup from '../base/formGroup';

import I18n from '../../utilities/I18n';

import { CONSTANTS } from '../../constants';

import { styleContainer } from '../../stylesContainer';

export default function RecordInfo({ info }) {
  return (
    <View style={styleContainer.containerContent}>
      <FormGroup
        type={CONSTANTS.TEXT}
        value={info.file_owner}
        editable={false}
        placeholder={I18n.t('record_owner')}
      />
      <FormGroup
        type={CONSTANTS.TEXT}
        value={info.address}
        editable={false}
        placeholder={I18n.t('address')}
        readOnlyStyle={{
          flexDirection: 'column'
        }}
        textValueStyle={{
          textAlign: 'left'
        }}
      />
      <FormGroup
        type={CONSTANTS.TEXT}
        value={info.file_name}
        editable={false}
        placeholder={I18n.t('record_name')}
        readOnlyStyle={{
          flexDirection: 'column'
        }}
        textValueStyle={{
          textAlign: 'left'
        }}
      />
      <FormGroup
        type={CONSTANTS.TEXT}
        value={moment(info.received_date).format(CONSTANTS.DATE_FORMAT1)}
        editable={false}
        placeholder={I18n.t('received_date')}
      />
      <FormGroup
        type={CONSTANTS.TEXT}
        value={moment(info.appointment_date).format(CONSTANTS.DATE_FORMAT1)}
        editable={false}
        placeholder={I18n.t('appointment_date')}
      />
      <FormGroup
        type={CONSTANTS.TEXT}
        value={info.status}
        editable={false}
        placeholder={I18n.t('status1')}
      />
    </View>
  );
}
