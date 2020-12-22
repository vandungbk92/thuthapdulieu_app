import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';
import { View, ScrollView, TouchableOpacity } from 'react-native';

import I18n from '../../utilities/I18n';

import { Files } from '../base/files';
import { Gallery } from '../base/gallery';
import FormGroup from '../base/formGroup';

import { CONSTANTS } from '../../constants';
import { timeFormatter } from '../../constants/dateFormat';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

export default class NoisoiHongDetail extends React.Component {
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
          {I18n.t('Chi tiết nội soi họng')}
        </RkText>
      ),
    };
  };

  render() {
    const { params } = this.props.navigation.state;

    return (
      <ScrollView style={styleContainer.containerContent}>
        <View style={tw.p4}>
          <View>
            <RkText rkType="header4">I. THÔNG TIN BỆNH NHÂN</RkText>
            <View style={tw.mT2}>
              <FormGroup
                type={CONSTANTS.TEXT}
                value={params.makham}
                readOnly={true}
                placeholder="Mã dữ liệu"
              />
              <FormGroup
                type={CONSTANTS.TEXT}
                value={params.tuoi}
                readOnly={true}
                placeholder="Tuổi"
                containerStyle={tw.mTPx}
              />
              <FormGroup
                type={CONSTANTS.TEXT}
                value={
                  (params.gioitinh === 'MALE' && 'Nam') ||
                  (params.gioitinh === 'FEMALE' && 'Nũ') ||
                  ''
                }
                readOnly={true}
                placeholder="Giới tính"
                containerStyle={tw.mTPx}
              />
              <FormGroup
                type={CONSTANTS.TEXT}
                value={params.tinhthanh_id?.tentinh}
                readOnly={true}
                placeholder="Tỉnh thành"
                containerStyle={tw.mTPx}
              />
              <FormGroup
                type={CONSTANTS.TEXT}
                value={params.quanhuyen_id?.tenqh}
                readOnly={true}
                placeholder="Quận huyện"
                containerStyle={tw.mTPx}
              />
              <FormGroup
                type={CONSTANTS.TEXT}
                value={params.phuongxa_id?.tenphuongxa}
                readOnly={true}
                placeholder="Phường xã"
                containerStyle={tw.mTPx}
              />
            </View>
          </View>
          <View style={tw.mT4}>
            <RkText rkType="header4">II. KHÁM BỆNH</RkText>
            <View style={tw.mT2}>
              <FormGroup
                type={CONSTANTS.TEXT}
                value={timeFormatter(params.created_at)}
                readOnly={true}
                placeholder="Thời gian"
              />
              <FormGroup
                type={CONSTANTS.TEXT_AREA}
                value={params.lydokham}
                readOnly={true}
                placeholder="Lý do đi khám"
                containerStyle={tw.mTPx}
              />
              <FormGroup
                type={CONSTANTS.TEXT_AREA}
                value={params.trieuchung_id
                  .map(({ trieuchung }) => trieuchung)
                  .join(', ')}
                readOnly={true}
                placeholder="Triệu chứng"
                containerStyle={tw.mTPx}
              />
              <Gallery
                items={params.hinhanh.map((hinhanh) => ({
                  source: { uri: hinhanh },
                }))}
                navigation={this.props.navigation}
                containerStyle={tw.mTPx}
              />
              <Files
                files={params.video.map((hinhanh) => ({
                  name: hinhanh,
                  download: hinhanh,
                }))}
                containerStyle={tw.mT1}
              />
            </View>
          </View>
          <View style={tw.mT4}>
            <RkText rkType="header4">III. KẾT LUẬN</RkText>
            <View style={tw.mT2}>
              <FormGroup
                type={CONSTANTS.TEXT_AREA}
                value={params.ketluan}
                readOnly={true}
                placeholder="Kết luận"
              />
              <FormGroup
                type={CONSTANTS.TEXT_AREA}
                value={params.benh_id.map(({ benh }) => benh).join(', ')}
                readOnly={true}
                placeholder="Bệnh"
                containerStyle={tw.mTPx}
              />
              <Gallery
                items={params.hinhanhkq.map((hinhanh) => ({
                  source: { uri: hinhanh },
                }))}
                navigation={this.props.navigation}
                containerStyle={tw.mTPx}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
