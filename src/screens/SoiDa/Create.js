import React from 'react';

import { tw } from 'react-native-tailwindcss';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

import I18n from '../../utilities/I18n';

import { Files } from '../base/files';
import { Gallery } from '../base/gallery';

import FormGroup from '../base/formGroup';
import GradientButton from '../base/gradientButton';

import {
  showToast,
  checkValidate,
  convertFiles,
  convertImagesGallery,
} from '../../epics-reducers/services/common';
import {
  uploadFiles,
  uploadImages,
} from '../../epics-reducers/services/fileImageServices';

import { CONSTANTS } from '../../constants';
import {
  SOI_DA,
  SOI_DA_DETAIL,
  VIEW_IMAGE_PAGE,
  IMAGE_BROWSER_PAGE,
} from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import {
  getBenh,
  getTrieuchung,
} from '../../epics-reducers/services/danhmucServices';
import {
  getTinhthanh,
  getQuanhuyenByTinhthanh,
  getPhuongxaByQuanhuyen,
} from '../../epics-reducers/services/hanhtrinhServices';
import { createData } from '../../epics-reducers/services/soidaServices';

import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';

export default class SoiDareate extends React.Component {
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
          {I18n.t('Thu thập dữ liệu soi da')}
        </RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      tuoi: '',
      gioitinh: '',

      tinhthanh_id: '',
      quanhuyen_id: '',
      phuongxa_id: '',

      lydokham: '',
      trieuchung_id: [],
      hinhanh: [],
      video: [],

      ketluan: '',
      benh_id: [],
      hinhanhkq: [],

      benhs: [],
      trieuchungs: [],

      tinhthanhs: [],
      quanhuyens: [],
      phuongxas: [],

      hinhanhUpload: [],
      videoUpload: [],
      hinhanhkqUpload: [],
    };
  }

  async componentDidMount() {
    const benhRes = await getBenh();
    if (benhRes && benhRes.docs) {
      const benhs = benhRes.docs;
      this.setState({ benhs });
    }

    const trieuchungRes = await getTrieuchung();
    if (trieuchungRes && trieuchungRes.docs) {
      const trieuchungs = trieuchungRes.docs;
      this.setState({ trieuchungs });
    }

    const tinhthanhRes = await getTinhthanh();
    if (tinhthanhRes && tinhthanhRes.docs) {
      const tinhthanhs = tinhthanhRes.docs;
      this.setState({ tinhthanhs });
    }
  }

  showActionSheet = () => {
    this.actionSheet.show();
  };

  onTinhthanhChange = async (id, selectedItems) => {
    const tinhthanhId = selectedItems[0]._id;
    const quanhuyens = await getQuanhuyenByTinhthanh(tinhthanhId);
    if (quanhuyens) {
      this.setState({
        tinhthanh_id: tinhthanhId,
        quanhuyen_id: '',
        phuongxa_id: '',

        quanhuyens,
        phuongxas: [],
      });
    }
  };

  onQuanhuyenChange = async (id, selectedItems) => {
    const quanhuyenId = selectedItems[0]._id;
    const phuongxas = await getPhuongxaByQuanhuyen(quanhuyenId);
    if (phuongxas) {
      this.setState({
        quanhuyen_id: quanhuyenId,
        phuongxa_id: '',

        phuongxas,
      });
    }
  };

  onPhuongxaChange = async (id, selectedItems) => {
    const phuongxaId = selectedItems[0]._id;
    this.setState({ phuongxa_id: phuongxaId });
  };

  toggleModal(index) {
    switch (index) {
      case 1:
        this.actionSheet.hide();
        setTimeout(() => this.pickImage(), 10);
        break;

      case 2:
        this.actionSheet.hide();
        setTimeout(() => this.pickCamera(), 10);
        break;

      case 3:
        this.props.navigation.navigate(VIEW_IMAGE_PAGE, {
          hinhanh: this.state.hinhanh,
        });
        break;

      default:
        break;
    }
  }

  async pickImage() {
    const { hinhanh } = this.state;
    const { status: statusCamera } = await Permissions.askAsync(
      Permissions.CAMERA,
    );
    const { status: statusCameraRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
    );
    if (statusCamera === 'granted' && statusCameraRoll === 'granted') {
      this.props.navigation.navigate(IMAGE_BROWSER_PAGE, {
        max: 5,
        total_exits: hinhanh ? hinhanh.length : 0,
        onGoBack: (callback) => this.imageBrowserCallback(callback),
      });
    } else {
      showToast(I18n.t('please_allow_the_application_to_access_memory'));
    }
  }

  async pickCamera() {
    const { status: statusCamera } = await Permissions.askAsync(
      Permissions.CAMERA,
    );
    const { status: statusCameraRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
    );
    if (statusCamera !== 'granted' || statusCameraRoll !== 'granted') {
      showToast(I18n.t('please_allow_the_application_to_access_camera'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({});
    if (!result.cancelled) {
      this.setState((state) => ({
        hinhanh: [...state.hinhanh, ...convertImagesGallery([result])],
        hinhanhUpload: [...state.hinhanhUpload, result],
      }));
    }
  }

  pickDocument = async () => {
    const { video } = this.state;
    const total_files = 5;

    if (Array.isArray(video) && video.length === total_files) {
      showToast(I18n.t('maximum_number_files').format(total_files));
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      //type: 'application/*',
      copyToCacheDirectory: false,
    });
    if (result.type !== 'cancel') {
      const fileNameSplit = result.name.split('.');
      const fileType = fileNameSplit[fileNameSplit.length - 1];
      if (
        fileType !== 'doc' &&
        fileType !== 'docx' &&
        fileType !== 'pdf' &&
        fileType !== 'xls' &&
        fileType !== 'xlsx'
      ) {
        showToast(I18n.t('inappropriate_file_format'));
        return;
      }
      if (result.size >= CONSTANTS.LIMIT_SIZE_OF_FILE) {
        showToast(
          I18n.t('beyond_the_allowed_capacity').format(
            CONSTANTS.LIMIT_SIZE_OF_FILE / 1000000,
          ),
        );
        return;
      }
      this.setState((state) => ({
        video: [...state.video, ...convertFiles([result])],
        videoUpload: [...state.videoUpload, result],
      }));
    }
  };

  imageBrowserCallback(callback) {
    if (callback === CONSTANTS.REJECT) {
      return;
    }

    callback
      .then((photos) => {
        this.setState((state) => ({
          hinhanh: [...state.hinhanh, ...convertImagesGallery(photos)],
          hinhanhUpload: [...state.hinhanhUpload, ...photos],
        }));
      })
      .catch((e) => null);
  }

  deleteFileFunc = async (file) => {
    let { video, videoUpload } = this.state;

    video = video.filter((data) => {
      return data.name !== file.name;
    });
    videoUpload = videoUpload.filter((data) => {
      return data.name !== file.name;
    });

    this.setState({ video, videoUpload });
  };

  deleteImgFunc = async (uri) => {
    let { hinhanh, hinhanhUpload } = this.state;

    hinhanh = hinhanh.filter((data) => {
      return data.source.uri !== uri;
    });
    hinhanhUpload = hinhanhUpload.filter((data) => {
      return data.file !== uri;
    });

    this.setState({ hinhanh, hinhanhUpload });
  };

  onFormSubmit = async () => {
    const dataValidate = [
      {
        type: CONSTANTS.REQUIRED,
        value: this.state.tuoi,
        alert: 'Tuổi',
      },
    ];
    if (!checkValidate(dataValidate)) return;
    const dataReq = {
      tuoi: this.state.tuoi,
      gioitinh: this.state.gioitinh,

      tinhthanh_id: this.state.tinhthanh_id,
      quanhuyen_id: this.state.quanhuyen_id,
      phuongxa_id: this.state.phuongxa_id,

      lydokham: this.state.lydokham,
      trieuchung_id: this.state.trieuchung_id,
      hinhanh: this.state.hinhanh,
      video: this.state.video,

      ketluan: this.state.ketluan,
      benh_id: this.state.benh_id,
    };
    if (this.state.hinhanhUpload.length) {
      const hinhanh = await uploadImages(this.state.hinhanhUpload);
      dataReq.hinhanh = hinhanh;
    }
    if (this.state.videoUpload.length) {
      const video = await uploadFiles(this.state.videoUpload);
      dataReq.video = video;
    }
    const responseData = await createData(dataReq);
    if (responseData) {
      showToast('Gửi dữ liệu thu thập soi da thành công');
      this.props.navigation.navigate(SOI_DA, { forceRefresh: true });
    }
  };

  render() {
    let { hinhanh, video } = this.state;
    let options = [
      <RkText>{I18n.t('reject')}</RkText>,
      <View style={[tw.flexRow, tw.itemsCenter]}>
        <Ionicons
          name="ios-folder"
          size={20}
          color={KittenTheme.colors.appColor}
        />
        <View style={tw.w1} />
        <RkText>{I18n.t('select_photos_from_the_device')}</RkText>
      </View>,
      <View style={[tw.flexRow, tw.itemsCenter]}>
        <Ionicons
          name="ios-camera"
          size={20}
          color={KittenTheme.colors.appColor}
        />
        <View style={tw.w1} />
        <RkText>{I18n.t('take_a_photo')}</RkText>
      </View>,
    ];
    if (hinhanh && hinhanh.length > 0) {
      options.push(
        <View style={[tw.flexRow, tw.itemsCenter]}>
          <Ionicons
            name="ios-eye"
            size={20}
            color={KittenTheme.colors.appColor}
          />
          <View style={tw.w1} />
          <RkText>{I18n.t('view_photo')}</RkText>
        </View>,
      );
    }

    return (
      <View style={styleContainer.containerContent}>
        <KeyboardAwareScrollView>
          <View style={tw.p4}>
            <View>
              <RkText rkType="header4">I. THÔNG TIN BỆNH NHÂN</RkText>
              <View style={tw.mT2}>
                <FormGroup
                  type={CONSTANTS.TEXT}
                  value={this.state.tuoi}
                  required={true}
                  editable={true}
                  placeholder={I18n.t('Tuổi')}
                  keyboardType="number-pad"
                  onChangeText={(id, value) => this.setState({ tuoi: value })}
                />
                <FormGroup
                  type={CONSTANTS.RADIO}
                  data={[
                    { _id: 'MALE', name: 'Nam' },
                    { _id: 'FEMALE', name: 'Nữ' },
                  ]}
                  placeholder={I18n.t('Giới tính')}
                  containerStyle={tw.mTPx}
                  onChange={(id, selectedId) =>
                    this.setState({ gioitinh: selectedId })
                  }
                />
                <FormGroup
                  type={CONSTANTS.SELECT}
                  value={[
                    {
                      display: CONSTANTS.NONE,
                      children: this.state.tinhthanhs,
                    },
                  ]}
                  single={true}
                  subKey="children"
                  displayKey="tentinh"
                  selectText={I18n.t('Tỉnh thành')}
                  selectedItems={[this.state.tinhthanh_id]}
                  containerStyle={tw.mTPx}
                  showCancelButton={true}
                  onCancel={(id, selected) => {}}
                  onConfirm={this.onTinhthanhChange}
                />
                <FormGroup
                  type={CONSTANTS.SELECT}
                  value={[
                    {
                      display: CONSTANTS.NONE,
                      children: this.state.quanhuyens,
                    },
                  ]}
                  single={true}
                  subKey="children"
                  displayKey="tenqh"
                  selectText={I18n.t('Quận huyện')}
                  selectedItems={[this.state.quanhuyen_id]}
                  containerStyle={tw.mTPx}
                  showCancelButton={true}
                  onCancel={(id, selected) => {}}
                  onConfirm={this.onQuanhuyenChange}
                />
                <FormGroup
                  type={CONSTANTS.SELECT}
                  value={[
                    { display: CONSTANTS.NONE, children: this.state.phuongxas },
                  ]}
                  single={true}
                  subKey="children"
                  displayKey="tenphuongxa"
                  selectText={I18n.t('Phường xã')}
                  selectedItems={[this.state.phuongxa_id]}
                  containerStyle={tw.mTPx}
                  showCancelButton={true}
                  onCancel={(id, selected) => {}}
                  onConfirm={this.onPhuongxaChange}
                />
              </View>
            </View>
            <View style={tw.mT4}>
              <RkText rkType="header4">II. KHÁM BỆNH</RkText>
              <View style={tw.mT2}>
                <FormGroup
                  type={CONSTANTS.TEXT_AREA}
                  value={this.state.lydokham}
                  editable={true}
                  placeholder="Lý do đi khám"
                  onChangeText={(id, value) => this.setState({ lydokham: value })}
              />
                <FormGroup
                  type={CONSTANTS.CHECKBOX}
                  data={this.state.trieuchungs}
                  displayKey="trieuchung"
                  placeholder={I18n.t('Triệu chứng')}
                  containerStyle={tw.mTPx}
                  onChange={(id, selectedIds) =>
                    this.setState({ trieuchung_id: selectedIds })
                  }
                />
                <View style={[tw.flexRow, tw.mTPx]}>
                  <GradientButton
                    text={I18n.t('attached_image')}
                    style={[tw.flex1, styleContainer.buttonGradient]}
                    onPress={this.showActionSheet}
                  />
                  <View style={tw.w1} />
                  <GradientButton
                    text={I18n.t('attached_file')}
                    style={[tw.flex1, styleContainer.buttonGradient]}
                    onPress={this.pickDocument}
                  />
                </View>
                <Gallery
                  items={hinhanh}
                  deleteImg={true}
                  navigation={this.props.navigation}
                  deleteImgFunc={this.deleteImgFunc}
                />
                <Files
                  files={video}
                  deleteFile={true}
                  deleteFileFunc={this.deleteFileFunc}
                />
              </View>
            </View>
            <View style={tw.mT4}>
              <RkText rkType="header4">III. KẾT LUẬN</RkText>
              <View style={tw.mT2}>
                <FormGroup
                  type={CONSTANTS.TEXT_AREA}
                  value={this.state.ketluan}
                  editable={true}
                  placeholder="Kết luận"
                  onChangeText={(id, value) => this.setState({ ketluan: value })}
                />
                <FormGroup
                  type={CONSTANTS.SELECT}
                  value={[
                    {
                      display: CONSTANTS.NONE,
                      children: this.state.benhs,
                    },
                  ]}
                  subKey="children"
                  displayKey="benh"
                  selectText={I18n.t('Bệnh')}
                  selectedItems={this.state.benh_id}
                  containerStyle={tw.mTPx}
                  showCancelButton={true}
                  onCancel={(id, selected) => {}}
                  onConfirm={(id, selectedIds) =>
                    this.setState({ benh_id: selectedIds })
                  }
                />
              </View>
            </View>
            <GradientButton
              text="Gửi dữ liệu"
              style={styleContainer.buttonGradient}
              onPress={this.onFormSubmit}
            />
          </View>
        </KeyboardAwareScrollView>
        <ActionSheet
          ref={(c) => (this.actionSheet = c)}
          onPress={(index) => this.toggleModal(index)}
          options={options}
          cancelButtonIndex={0}
          destructiveButtonIndex={4}
        />
      </View>
    );
  }
}
