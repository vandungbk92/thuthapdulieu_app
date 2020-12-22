import React from 'react';

import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, TouchableOpacity } from 'react-native';

import I18n from '../../utilities/I18n';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import { CONSTANTS } from '../../constants';
import { NOISOI_HONG } from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';

export default class NoisoiHongFilter extends React.Component {
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
          {I18n.t('Điều kiện tìm kiếm')}
        </RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    this.state = {
      makham: params?.makham || '',
      fromDate: params?.fromDate || '',
      toDate: params?.toDate || '',
    };
  }

  resetForm = () => {
    this.setState({
      makham: '',
      fromDate: '',
      toDate: '',
    });
  };

  submitForm = async () => {
    const { makham, fromDate, toDate } = this.state;
    const params = {
      makham,
      fromDate,
      toDate,
      forceRefresh: true,
    };
    this.props.navigation.navigate(NOISOI_HONG, params);
  };

  render() {
    return (
      <KeyboardAwareScrollView style={styleContainer.containerContent}>
        <View style={tw.p4}>
          <FormGroup
            type={CONSTANTS.TEXT}
            value={this.state.makham}
            editable={true}
            placeholder="Mã dữ liệu"
            onChangeText={(id, value) => this.setState({ makham: value })}
          />
          <View style={[tw.flexRow, tw.mT1, tw.itemsCenter]}>
            <FormGroup
              type={CONSTANTS.DATE_TIME}
              value={this.state.fromDate}
              placeholder="Từ ngày"
              contentStyle={tw.flexCol}
              onChangeText={(id, value) => this.setState({ fromDate: value })}
              containerStyle={tw.flex1}
            />
            <RkText style={tw.pX2}>~</RkText>
            <FormGroup
              type={CONSTANTS.DATE_TIME}
              value={this.state.toDate}
              placeholder="Đến ngày"
              contentStyle={tw.flexCol}
              onChangeText={(id, value) => this.setState({ toDate: value })}
              containerStyle={tw.flex1}
            />
          </View>
          <View style={tw.flexRow}>
            <GradientButton
              text="Bỏ lọc"
              style={[tw.flex1, styleContainer.buttonGradient]}
              onPress={this.resetForm}
            />
            <View style={tw.w2} />
            <GradientButton
              text="Áp dụng"
              style={[tw.flex1, styleContainer.buttonGradient]}
              onPress={this.submitForm}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
