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
import { VIEW_IMAGE_PAGE, IMAGE_BROWSER_PAGE } from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import {
  getTinhthanh,
  getQuanhuyenByTinhthanh,
  getPhuongxaByQuanhuyen,
} from '../../epics-reducers/services/hanhtrinhServices';
import { createData } from '../../epics-reducers/services/noisoiTaiServices';

import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';

export default class NoisoiTaiCreate extends React.Component {
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
          {I18n.t('Thu thập dữ liệu nội soi tai')}
        </RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      tuoi: null,
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

      tinhthanhs: [],
      quanhuyens: [],
      phuongxas: [],

      hinhanhUpload: [],
      videoUpload: [],
      hinhanhkqUpload: [],
    };
  }

  async componentDidMount() {
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
    const wardId = selectedItems[0]._id;
    this.setState({ ward_id: wardId });
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
          images: this.state.images,
        });
        break;

      default:
        break;
    }
  }

  async pickImage() {
    const { images } = this.state;
    const { status: statusCamera } = await Permissions.askAsync(
      Permissions.CAMERA,
    );
    const { status: statusCameraRoll } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
    );
    if (statusCamera === 'granted' && statusCameraRoll === 'granted') {
      this.props.navigation.navigate(IMAGE_BROWSER_PAGE, {
        max: 5,
        total_exits: images ? images.length : 0,
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
        images: [...state.images, ...convertImagesGallery([result])],
        imageUpload: [...state.imageUpload, result],
      }));
    }
  }

  pickDocument = async () => {
    const { files } = this.state;
    const total_files = 5;

    if (Array.isArray(files) && files.length === total_files) {
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
        files: [...state.files, ...convertFiles([result])],
        fileUpload: [...state.fileUpload, result],
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
          images: [...state.images, ...convertImagesGallery(photos)],
          imageUpload: [...state.imageUpload, ...photos],
        }));
      })
      .catch((e) => null);
  }

  deleteFileFunc = async (file) => {
    let { files, fileUpload } = this.state;

    files = files.filter((data) => {
      return data.name !== file.name;
    });
    fileUpload = fileUpload.filter((data) => {
      return data.name !== file.name;
    });

    this.setState({
      files: files,
      fileUpload: fileUpload,
    });
  };

  deleteImgFunc = async (uri) => {
    let { images, imageUpload } = this.state;

    images = images.filter((data) => {
      return data.source.uri !== uri;
    });
    imageUpload = imageUpload.filter((data) => {
      return data.file !== uri;
    });

    this.setState({
      images: images,
      imageUpload: imageUpload,
    });
  };

  onFormSubmit = async () => {
    const dataValidate = [
      {
        type: CONSTANTS.REQUIRED,
        value: this.state.noidung,
        alert: 'Nội dung',
      },
    ];
    if (!checkValidate(dataValidate)) return;

    const dataReq = {
      lienket: this.state.lienket,
      noidung: this.state.noidung,
    };

    if (this.state.fileUpload.length) {
      const files = await uploadFiles(this.state.fileUpload);
      dataReq.teptin = files;
    }
    if (this.state.imageUpload.length) {
      const images = await uploadImages(this.state.imageUpload);
      dataReq.hinhanh = images;
    }

    const responseData = await createRequest(dataReq);
    if (responseData) {
      showToast('Gửi yêu cầu xác minh thông tin thành công');
      this.props.navigation.navigate(XACMINH_THONGTIN, { forceRefresh: true });
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
                  onChangeText={(id, value) => this.setState({ tuoi: value })}
                />
                <FormGroup
                  type={CONSTANTS.RADIO}
                  data={[{ _id: 'MALE', name: 'Nam', }, { _id: 'FEMALE', name: 'Nữ', }]}
                  value={this.state.gioitinh}
                  placeholder={I18n.t('Giới tính')}
                  onChange={(id, selectedItem) => this.setState({ gioitinh: selectedItem._id })}
                />
                <FormGroup
                  type={CONSTANTS.SELECT}
                  value={[
                    { display: CONSTANTS.NONE, children: this.state.tinhthanhs },
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
