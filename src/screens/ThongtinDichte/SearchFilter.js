import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { connect } from 'react-redux';

import { View, TouchableOpacity } from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Entypo, Ionicons } from '@expo/vector-icons';

import I18n from '../../utilities/I18n';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import { CONSTANTS } from '../../constants';
import * as ROUTER from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import {
  getAllProvince,
  getDistrictsByProvince,
  getWardsByDistrict,
} from '../../epics-reducers/services/residenceServices';

import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';

class ThongtinDichteFilter extends React.Component {
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
          {I18n.t('Điều kiện tìm kiếm dịch tễ')}
        </RkText>
      ),
    };
  };

  state = {
    benhnhanso: '', // Bệnh nhân số
    ngay: '', // Ngày

    province_id: '', // Tỉnh
    province_name: '',

    district_id: '', // Huyện
    district_name: '',

    ward_id: '', // Xã
    ward_name: '',

    tukhoa: '', // Từ khóa

    provinces: [], // Ds tỉnh
    districts: [], // Ds huyện
    wards: [], // Ds xã
  };

  async componentDidMount() {
    const responseData = await getAllProvince();
    const provinces = responseData?.docs;
    if (provinces) {
      this.setState({ provinces });
    }

    if (this.props.setting.province_id) {
      this.onProvinceChange('province_id', [this.props.setting.province_id]);
    }
  }

  resetForm = () => {
    this.setState({
      benhnhanso: '', // Bệnh nhân số
      ngay: '', // Ngày

      district_id: '', // Huyện
      district_name: '',

      ward_id: '', // Xã
      ward_name: '',

      tukhoa: '', // Từ khóa

      wards: [], // Ds xã
    });
  };

  submitForm = async () => {
    const {
      benhnhanso,
      ngay,
      province_id,
      province_name,
      district_id,
      district_name,
      ward_id,
      ward_name,
      tukhoa,
    } = this.state;
    const params = {
      benhnhanso,
      ngay,
      province_id,
      province_name,
      district_id,
      district_name,
      ward_id,
      ward_name,
      tukhoa,
    };
    this.props.navigation.navigate(ROUTER.THONGTIN_DICHTE, params);
  };

  onProvinceChange = async (id, selectedItems) => {
    const { _id: province_id, name: province_name } = selectedItems[0];
    const districts = await getDistrictsByProvince(province_id);
    if (districts) {
      this.setState({
        province_id,
        province_name,
        district_id: '',
        district_name: '',
        districts,
        ward_id: '',
        ward_name: '',
        wards: [],
      });
    }
  };

  onDistrictChange = async (id, selectedItems) => {
    const { _id: district_id, name: district_name } = selectedItems[0];
    const wards = await getWardsByDistrict(district_id);
    if (wards) {
      this.setState({
        district_id,
        district_name,
        ward_id: '',
        ward_name: '',
        wards,
      });
    }
  };

  onWardChange = async (id, selectedItems) => {
    const { _id: ward_id, name: ward_name } = selectedItems[0];
    this.setState({ ward_id, ward_name });
  };

  render() {
    return (
      <KeyboardAwareScrollView style={styleContainer.containerContent}>
        <View style={tw.p4}>
          <RkText style={tw.textOrange500}>
            <RkText style={tw.textOrange500} rkType="bold">
              *
            </RkText>
            {I18n.t(' Thông tin dịch tễ liên quan đến Tỉnh Thanh Hóa')}
          </RkText>
          {/* <FormGroup
            type={CONSTANTS.SELECT}
            value={[
              { display: CONSTANTS.NONE, children: this.state.provinces },
            ]}
            single={true}
            subKey="children"
            selectText={I18n.t('Tỉnh/Thành phố')}
            selectedItems={[this.state.province_id]}
            containerStyle={tw.mT1}
            showCancelButton={true}
            onCancel={(id, selected) => {}}
            onConfirm={this.onProvinceChange}
          /> */}
          <FormGroup
            type={CONSTANTS.TEXT}
            value={this.state.benhnhanso}
            editable={true}
            placeholder={I18n.t('Bệnh nhân số')}
            placeholderText="Nhập số thứ tự ca bệnh. Ví dụ: 748"
            keyboardType="numeric"
            containerStyle={tw.mT2}
            onChangeText={(id, value) => this.setState({ benhnhanso: value })}
          />
          <FormGroup
            type={CONSTANTS.DATE_TIME}
            value={this.state.ngay}
            dateFormat={this.props.setting.format_date}
            placeholder={I18n.t('Ngày')}
            contentStyle={tw.flexCol}
            containerStyle={tw.mT1}
            onChangeText={(id, value) => this.setState({ ngay: value })}
          />
          <FormGroup
            type={CONSTANTS.SELECT}
            value={[
              { display: CONSTANTS.NONE, children: this.state.districts },
            ]}
            single={true}
            subKey="children"
            selectText={I18n.t('Huyện/Thị Xã/Thành Phố')}
            selectedItems={[this.state.district_id]}
            containerStyle={tw.mT1}
            showCancelButton={true}
            onCancel={(id, selected) => {}}
            onConfirm={this.onDistrictChange}
          />
          <FormGroup
            type={CONSTANTS.SELECT}
            value={[{ display: CONSTANTS.NONE, children: this.state.wards }]}
            single={true}
            subKey="children"
            selectText={I18n.t('Phường/Xã')}
            selectedItems={[this.state.ward_id]}
            containerStyle={tw.mT1}
            showCancelButton={true}
            onCancel={(id, selected) => {}}
            onConfirm={this.onWardChange}
          />
          {/* <View style={[tw.flexRow, tw.mT1]}>
            <FormGroup
              type={CONSTANTS.DATE_TIME}
              value={this.state.date_from}
              dateFormat={this.props.setting.format_date}
              placeholder={I18n.t('Từ ngày')}
              contentStyle={tw.flexCol}
              containerStyle={tw.flex1}
              onChangeText={(id, value) => this.setState({ date_from: value })}
            />
            <View style={tw.w1} />
            <FormGroup
              type={CONSTANTS.DATE_TIME}
              value={this.state.date_to}
              dateFormat={this.props.setting.format_date}
              placeholder={I18n.t('Đến ngày')}
              contentStyle={tw.flexCol}
              containerStyle={tw.flex1}
              onChangeText={(id, value) => this.setState({ date_to: value })}
            />
          </View> */}
          <FormGroup
            type={CONSTANTS.TEXT}
            value={this.state.tukhoa}
            editable={true}
            placeholder={I18n.t('Từ khóa tìm kiếm')}
            containerStyle={tw.mT1}
            onChangeText={(id, value) => this.setState({ tukhoa: value })}
          />
          <View style={[tw.flexRow]}>
            <GradientButton
              text={I18n.t('Bỏ lọc')}
              style={[tw.flex1, styleContainer.buttonGradient]}
              onPress={this.resetForm}
            />
            <View style={tw.w2} />
            <GradientButton
              text={I18n.t('Áp dụng')}
              style={[tw.flex1, styleContainer.buttonGradient]}
              onPress={this.submitForm}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const { setting } = state;
  return { setting };
};

export default connect(mapStateToProps)(ThongtinDichteFilter);
