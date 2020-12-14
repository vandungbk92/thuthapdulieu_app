import React from 'react';

import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, ScrollView, TouchableOpacity } from 'react-native';

import I18n from '../../utilities/I18n';

import FormGroup from '../base/formGroup';

import { CONSTANTS } from '../../constants';
import { timeFormatter } from '../../constants/dateFormat';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { updateViewYn } from '../../epics-reducers/services/hopthucongdanServices';

export default class HopthuCongdanDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => navigation.goBack(null)}
        >
          <Ionicons
            name="ios-arrow-back"
            size={20}
            color={KittenTheme.colors.primaryText}
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>
          {I18n.t('Chi tiết hộp thư')}
        </RkText>
      ),
    };
  };

  async componentDidMount() {
    const { params } = this.props.navigation.state;
    if (!params.viewYn) {
      await updateViewYn(params._id);
    }
  }

  render() {
    const { params } = this.props.navigation.state;

    return (
      <ScrollView style={styleContainer.containerContent}>
        <View style={tw.p4}>
          {!!params.title && <RkText rkType="header4">{params.title}</RkText>}
          <View style={tw.mT2}>
            <FormGroup
              type={CONSTANTS.TEXT}
              value={timeFormatter(params.created_at)}
              readOnly={true}
              placeholder="Thời gian"
            />
            <FormGroup
              type={CONSTANTS.TEXT_AREA}
              value={params.content}
              readOnly={true}
              placeholder="Nội dung"
              containerStyle={tw.mT1}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
