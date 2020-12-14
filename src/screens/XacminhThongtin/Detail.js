import React from 'react';

import { tw, color } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, ScrollView, TouchableOpacity } from 'react-native';

import Modal from 'react-native-modal';
import HTMLView from 'react-native-htmlview';

import { Files } from '../base/files';
import { Gallery } from '../base/gallery';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import I18n from '../../utilities/I18n';

import { CONSTANTS } from '../../constants';
import { XACMINH_THONGTIN } from '../../constants/router';

import { timeFormatter } from '../../constants/dateFormat';

import {
  convertFiles,
  convertImagesGallery,
} from '../../epics-reducers/services/common';
import { showToast, checkValidate } from '../../epics-reducers/services/common';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { updateRequest } from '../../epics-reducers/services/xacminhthongtinServices';

export default class XacminhThongtinDetail extends React.Component {
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
          {I18n.t('Chi tiết yêu cầu xác minh')}
        </RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      noidungbosung: '',
    };
  }

  onFormSubmit = async () => {
    const dataValidate = [
      {
        type: CONSTANTS.REQUIRED,
        value: this.state.noidungbosung,
        alert: 'Nội dung bổ sung',
      },
    ];
    if (!checkValidate(dataValidate)) return;

    const dataReq = {
      noidungbosung: this.state.noidungbosung,
    };
    const { params } = this.props.navigation.state;

    const responseData = await updateRequest(params._id, dataReq);
    if (responseData) {
      showToast('Gửi nội dung bổ sung thông tin thành công');
      this.setState({ modalVisible: false }, () => {
        this.props.navigation.navigate(XACMINH_THONGTIN, { forceRefresh: true });
      });
    }
  };

  render() {
    const { params } = this.props.navigation.state;

    const files = convertFiles(params.teptin);
    const images = convertImagesGallery(params.hinhanh);

    return (
      <View style={styleContainer.containerContent}>
        <ScrollView>
          <View style={tw.p4}>
            <View style={tw.itemsStart}>
              <View style={[tw.pX2, tw.pY1, tw.rounded, tw.bgGray300]}>
                <RkText>
                  {(params.tiepnhan === -1 && 'Chờ xác minh') ||
                    (params.tiepnhan === 0 && 'Từ chối xác minh') ||
                    (params.tiepnhan === 1 && 'Bổ sung thông tin') ||
                    (params.tiepnhan === 2 && 'Đã xác minh')}
                </RkText>
              </View>
            </View>
            <View style={tw.pT2}>
              <View style={[tw.flexRow, tw.itemsCenter]}>
                <Ionicons name="md-code" size={18} color={color.gray600} />
                <RkText style={[tw.pL1, tw.textSm]}>{params.maxacminh}</RkText>
              </View>
              <View style={[tw.flexRow, tw.mTPx]}>
                <Ionicons name="ios-link" size={18} color={color.gray600} />
                {params.lienket ? (
                  <RkText
                    rkType="bold"
                    style={[tw.pL1, tw.pTPx, tw.textBlue500]}
                  >
                    {params.lienket}
                  </RkText>
                ) : (
                  <RkText style={[tw.pL1, tw.pTPx]}>N/A</RkText>
                )}
              </View>
              <View style={[tw.flexRow, tw.mTPx, tw.itemsCenter]}>
                <Ionicons name="md-time" size={18} color={color.gray600} />
                <RkText style={[tw.pL1, tw.textSm]}>
                  {timeFormatter(params.created_at)}
                </RkText>
              </View>
            </View>
            <View style={tw.pY2}>
              <RkText>{params.noidung}</RkText>
            </View>
            {(params.tiepnhan === 0 ||
              params.tiepnhan === 1 ||
              (params.tiepnhan === 2 && params.noidungbosung)) && (
              <View style={[tw.mY2, tw.pY2, tw.borderGray400, tw.borderY]}>
                {params.tiepnhan === 0 && (
                  <>
                    <RkText rkType="bold">Lý do từ chối</RkText>
                    <RkText style={tw.mTPx}>{params.lydotuchoi}</RkText>
                  </>
                )}
                {params.tiepnhan === 1 && !params.noidungbosung && (
                  <>
                    <RkText rkType="bold">Lý do bổ sung</RkText>
                    <RkText style={tw.mTPx}>{params.lydobosung}</RkText>
                  </>
                )}
                {params.tiepnhan === 1 && !!params.noidungbosung && (
                  <>
                    <RkText rkType="bold">Nội dung bổ sung</RkText>
                    <RkText style={tw.mTPx}>{params.noidungbosung}</RkText>
                  </>
                )}
                {params.tiepnhan === 2 && !!params.noidungbosung && (
                  <>
                    <RkText rkType="bold">Nội dung bổ sung</RkText>
                    <RkText style={tw.mTPx}>{params.noidungbosung}</RkText>
                  </>
                )}
              </View>
            )}
            {params.noidungtraloi && (
              <View style={[tw.mY2, tw.p2, tw.rounded, tw.bgGray200]}>
                <HTMLView value={params.noidungtraloi} />
                <RkText style={[tw.textSm, tw.textRight, tw.textGray600]}>
                  {timeFormatter(params.thoigiantraloi)}
                </RkText>
              </View>
            )}
            <View style={tw.pY2}>
              <Files files={files} containerStyle={tw.mT1} />
              <Gallery
                items={images}
                navigation={this.props.navigation}
                containerStyle={tw.mT1}
              />
            </View>
          </View>
        </ScrollView>
        {params.tiepnhan === 1 && !params.noidungbosung && (
          <View style={[tw.absolute, tw.p4, tw.bottom0, tw.right0]}>
            <TouchableOpacity
              style={[
                tw.flexRow,
                tw.p3,
                tw.w40,
                tw.roundedFull,
                tw.itemsCenter,
                tw.justifyCenter,
                { backgroundColor: KittenTheme.colors.appColor },
              ]}
              onPress={() => this.setState({ modalVisible: true })}
            >
              <RkText rkType="bold" style={tw.textWhite}>
                Bổ sung thông tin
              </RkText>
            </TouchableOpacity>
          </View>
        )}
        <Modal
          isVisible={this.state.modalVisible}
          animationIn="fadeIn"
          animationOut="fadeOut"
          avoidKeyboard
          useNativeDriver
          hideModalContentWhileAnimating
          onBackdropPress={() => this.setState({ modalVisible: false })}
          onBackButtonPress={() => this.setState({ modalVisible: false })}
        >
          <View style={[tw.p4, tw.bgWhite, tw.rounded]}>
            <FormGroup
              type={CONSTANTS.TEXT_AREA}
              value={this.state.noidungbosung}
              required={true}
              editable={true}
              placeholder="Nội dung bổ sung"
              onChangeText={(id, value) => this.setState({ noidungbosung: value })}
            />
            <GradientButton
              text="Đồng ý"
              style={[styleContainer.buttonGradient, tw.mY0, tw.mT2]}
              onPress={this.onFormSubmit}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
