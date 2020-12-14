import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { tw } from 'react-native-tailwindcss';

import { connect } from 'react-redux';

import { Ionicons } from '@expo/vector-icons';
import { RkText, RkChoice } from 'react-native-ui-kitten';

import I18n from '../../utilities/I18n';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import {
  taomoiPhananh,
  getDanhmucPhananh,
} from '../../epics-reducers/services/medicalSevices';
import {
  getAllProvince,
  getDistrictsByProvince,
  getWardsByDistrict,
} from '../../epics-reducers/services/residenceServices';
import { showToast, checkValidate } from '../../epics-reducers/services/common';

import { CONSTANTS } from '../../constants';
import { LOGIN_PAGE } from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';

class MedicalReflection extends React.Component {
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
          {I18n.t('Phản ánh dịch Covid-19')}
        </RkText>
      ),
    };
  };
  constructor(props){
    super(props);
    let {userInfo} = this.props
    this.state = {
      isConfirm: false,

      danhmucphananh_id: [],
      noidung: '',
      thoigian: new Date(),
      province_id: '',
      district_id: '',
      ward_id: '',
      diachi: '',
      full_name: userInfo && userInfo.full_name ? userInfo.full_name : '',
      phone: userInfo && userInfo.phone ? userInfo.phone : '',

      danhmucPhananh: [],

      provinces: [],
      districts: [],
      wards: [],
    };
  }


  async componentDidMount() {
    const danhmucPhananhRes = await getDanhmucPhananh();
    if (danhmucPhananhRes && danhmucPhananhRes.docs) {
      this.setState({ danhmucPhananh: danhmucPhananhRes.docs });
    }

    const provinceRes = await getAllProvince();
    if (provinceRes && provinceRes.docs) {
      this.setState({ provinces: provinceRes.docs });
    }

    if (this.props.setting.province_id) {
      await this.onProvinceChange('province_id', [
        this.props.setting.province_id,
      ]);
    }

  }

  onFormSubmit = async () => {

    let dataReq = {
      danhmucphananh_id: this.state.danhmucphananh_id,
      noidung: this.state.noidung,
      thoigian: this.state.thoigian,
      province_id: this.state.province_id,
      district_id: this.state.district_id,
      ward_id: this.state.ward_id,
      diachi: this.state.diachi,
      full_name: this.state.full_name,
      phone: this.state.phone,
    };

    if(!this.state.danhmucphananh_id.length && !this.state.noidung){
      showToast("Trường hợp phản ánh hoặc nội dung phản ánh là bắt buộc nhập");
      return;
    }
    const dataValidate = [
      {
        type: CONSTANTS.REQUIRED,
        value: dataReq.full_name,
        alert: I18n.t('full_name'),
      },
      {
        type: CONSTANTS.PHONE,
        value: dataReq.phone,
        alert: I18n.t('phone'),
      },
      {
        type: CONSTANTS.REQUIRED,
        value: dataReq.province_id,
        alert: I18n.t('Tỉnh/Thành phố'),
      },
      {
        type: CONSTANTS.REQUIRED,
        value: dataReq.district_id,
        alert: I18n.t('Quận/Huyện'),
      },
      {
        type: CONSTANTS.REQUIRED,
        value: dataReq.ward_id,
        alert: I18n.t('Phường/Xã'),
      },
    ];
    if (!checkValidate(dataValidate)) return;
    if(!this.state.isConfirm){
      showToast("Vui lòng xác nhận cam kết thông tin khai báo.");
      return;
    }

    const dataRes = await taomoiPhananh(dataReq);
    if (dataRes && dataRes._id) {
      showToast(I18n.t('Phản ánh dịch Covid-19 thành công'));
      this.props.navigation.pop(1);
    }
  };

  onPhananhChange = (id, selectedIds) => {
    this.setState({ [id]: selectedIds });
  };

  onProvinceChange = async (id, selectedItems) => {
    const provinceId = selectedItems[0]._id;
    const districtRes = await getDistrictsByProvince(provinceId);
    if (districtRes) {
      this.setState({
        province_id: provinceId,
        district_id: '',
        ward_id: '',

        districts: districtRes,
        wards: [],
      });
    }
  };

  onDistrictChange = async (id, selectedItems) => {
    const districtId = selectedItems[0]._id;
    const wardRes = await getWardsByDistrict(districtId);
    if (wardRes) {
      this.setState({
        district_id: districtId,
        ward_id: '',

        wards: wardRes,
      });
    }
  };

  onWardChange = async (id, selectedItems) => {
    const wardId = selectedItems[0]._id;
    this.setState({ ward_id: wardId });
  };

  changeCitizenElement(id, event) {
    this.state.citizen[id] = event
    this.setState(this.state)
  }

  render() {
    return (
      <View style={[tw.flex1, tw.bgWhite]}>
        <KeyboardAwareScrollView>
          <View style={tw.p4}>

            <FormGroup
              type={CONSTANTS.TEXT}
              required={true}
              value={this.state.full_name}
              editable={true}
              placeholder={I18n.t("full_name")}
              containerStyle={tw.mT1}
              onChangeText={(id, value) => this.setState({ full_name: value })}
            />

            <FormGroup
              type={CONSTANTS.TEXT}
              required={true}
              value={this.state.phone}
              editable={true}
              placeholder={I18n.t("phone")}
              containerStyle={tw.mT1}
              onChangeText={(id, value) => this.setState({ phone: value })}
            />

            <FormGroup
              id="danhmucphananh_id"
              type={CONSTANTS.CHECKBOX}
              data={this.state.danhmucPhananh}
              placeholder={I18n.t('Chọn các trường hợp phản ánh')}
              onChange={this.onPhananhChange}
            />
            <FormGroup
              type={CONSTANTS.TEXT_AREA}
              value={this.state.noidung}
              editable={true}
              placeholder={I18n.t('Nội dung phản ánh khác')}
              containerStyle={tw.mT1}
              onChangeText={(id, value) => this.setState({ noidung: value })}
            />
            <FormGroup
              type={CONSTANTS.DATE_TIME}
              value={this.state.thoigian}
              required={true}
              dateFormat={this.props.setting.format_date}
              placeholder={I18n.t('Thời gian phát hiện')}
              contentStyle={tw.flexCol}
              containerStyle={tw.mT1}
              onChangeText={(id, value) => this.setState({ thoigian: value })}
            />
            <View style={tw.mY2}>
              <RkText rkType="header6">{I18n.t('Địa điểm xảy ra')}</RkText>
              <FormGroup
                type={CONSTANTS.SELECT}
                value={[
                  { display: CONSTANTS.NONE, children: this.state.provinces },
                ]}
                single={true}
                subKey="children"
                required={true}
                selectText={I18n.t('Tỉnh/Thành phố')}
                selectedItems={[this.state.province_id]}
                containerStyle={tw.mT1}
                showCancelButton={true}
                onCancel={(id, selected) => {}}
                onConfirm={this.onProvinceChange}
              />

              <FormGroup
                type={CONSTANTS.SELECT}
                value={[
                  { display: CONSTANTS.NONE, children: this.state.districts },
                ]}
                single={true}
                subKey="children"
                required={true}
                selectText={I18n.t('Quận/Huyện')}
                selectedItems={[this.state.district_id]}
                containerStyle={tw.mT1}
                showCancelButton={true}
                onCancel={(id, selected) => {}}
                onConfirm={this.onDistrictChange}
              />
              <FormGroup
                type={CONSTANTS.SELECT}
                value={[
                  { display: CONSTANTS.NONE, children: this.state.wards },
                ]}
                single={true}
                subKey="children"
                required={true}
                selectText={I18n.t('Phường/Xã')}
                selectedItems={[this.state.ward_id]}
                containerStyle={tw.mT1}
                showCancelButton={true}
                onCancel={(id, selected) => {}}
                onConfirm={this.onWardChange}
              />
              <FormGroup
                type={CONSTANTS.TEXT}
                value={this.state.diachi}
                editable={true}
                placeholder={I18n.t('Số nhà, đường')}
                containerStyle={tw.mT1}
                onChangeText={(id, value) => this.setState({ diachi: value })}
              />
            </View>
            <TouchableOpacity
              style={tw.p2}
              onPress={() => {
                this.setState((state) => ({ isConfirm: !state.isConfirm }));
              }}
            >
              <View style={[tw.flexRow]}>
                <RkChoice
                  style={{ marginTop: 2 }}
                  selected={this.state.isConfirm}
                  onChange={(selected) => {
                    this.setState({ isConfirm: selected });
                  }}
                />
                <RkText style={[tw.flex1, tw.mL2]}>
                  {I18n.t(
                    'Tôi cam kết các thông tin khai báo là đúng sự thật và đồng ý chia sẻ vị trí để cơ quan chức năng có thể hỗ trợ tốt nhất',
                  )}
                </RkText>
              </View>
            </TouchableOpacity>
            <GradientButton
              text={I18n.t('Gửi thông tin')}
              style={styleContainer.buttonGradient}
              // disabled={!this.state.isConfirm}
              onPress={this.onFormSubmit}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { setting, userInfoRes } = state;
  return { setting, userInfo: userInfoRes };
};

export default connect(mapStateToProps)(MedicalReflection);
