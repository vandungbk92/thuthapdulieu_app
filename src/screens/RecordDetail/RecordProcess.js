import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import moment from 'moment';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import FormGroup from '../base/formGroup';

import I18n from '../../utilities/I18n';

import { CONSTANTS } from '../../constants';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

export default class RecordProcess extends React.Component {
  state = {
    isOpen: true
  };

  onOpenToggle = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  render() {
    const { info } = this.props;

    return (
      <View style={[styles.container, styleContainer.boxShadow]}>
        <TouchableOpacity onPress={this.onOpenToggle}>
          <FormGroup
            type={CONSTANTS.TEXT}
            value={info.implementer}
            border={false}
            shadow={false}
            editable={false}
            labelIcon={
              <MaterialIcons
                name="person"
                size={20}
                color={KittenTheme.colors.appColor}
              />
            }
            searchIcon={
              <Ionicons
                name={this.state.isOpen ? 'ios-arrow-up' : 'ios-arrow-down'}
                size={20}
                color={KittenTheme.colors.appColor}
              />
            }
            placeholder={I18n.t('implementer')}
            readOnlyStyle={{
              flexDirection: 'column'
            }}
            labelIconStyle={{
              alignSelf: 'flex-start'
            }}
            textValueStyle={{
              textAlign: 'left'
            }}
          />
        </TouchableOpacity>
        {this.state.isOpen &&
          <View style={styles.hiddenContent}>
            <FormGroup
              type={CONSTANTS.TEXT}
              value={info.content}
              border={false}
              shadow={false}
              editable={false}
              labelIcon={
                <MaterialIcons
                  name="description"
                  size={20}
                  color={KittenTheme.colors.appColor}
                />
              }
              placeholder={I18n.t('record_content')}
              readOnlyStyle={{
                flexDirection: 'column'
              }}
              labelIconStyle={{
                alignSelf: 'flex-start'
              }}
              textValueStyle={{
                textAlign: 'left'
              }}
            />
            <FormGroup
              type={CONSTANTS.TEXT}
              value={info.receiver}
              border={false}
              shadow={false}
              editable={false}
              labelIcon={
                <MaterialIcons
                  name="person-pin"
                  size={20}
                  color={KittenTheme.colors.appColor}
                />
              }
              placeholder={I18n.t('receiver')}
              readOnlyStyle={{
                flexDirection: 'column'
              }}
              labelIconStyle={{
                alignSelf: 'flex-start'
              }}
              textValueStyle={{
                textAlign: 'left'
              }}
            />
            <FormGroup
              type={CONSTANTS.TEXT}
              border={false}
              shadow={false}
              editable={false}
              labelIcon={
                <MaterialIcons
                  name="access-time"
                  size={20}
                  color={KittenTheme.colors.appColor}
                />
              }
              placeholder={moment(info.date_process).format(
                CONSTANTS.DATE_TIME_FORMAT1
              )}
              labelIconStyle={{
                alignSelf: 'flex-start'
              }}
            />
          </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginBottom: 15,
    borderColor: KittenTheme.border.borderColor,
    borderWidth: KittenTheme.border.borderWidth,
    borderRadius: KittenTheme.border.borderRadius,
    backgroundColor: KittenTheme.colors.white
  }
});
