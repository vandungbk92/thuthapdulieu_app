import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { tw } from 'react-native-tailwindcss';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import { Ionicons } from '@expo/vector-icons';
import { RkText } from 'react-native-ui-kitten';

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
import { XACMINH_THONGTIN, VIEW_IMAGE_PAGE, IMAGE_BROWSER_PAGE } from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { createRequest } from '../../epics-reducers/services/xacminhthongtinServices';

import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';

export default class XacminhThongtinCreate extends React.Component {
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
          {I18n.t('Yêu cầu xác minh thông tin')}
        </RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      lienket: '',
      noidung: '',

      files: [],
      images: [],

      fileUpload: [],
      imageUpload: [],
    };
  }

  showActionSheet = () => {
    this.actionSheet.show();
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
    let { files, images } = this.state;
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
    if (images && images.length > 0) {
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
            <RkText>
              Vui lòng nhập đường dẫn (địa chỉ) nguồn tin vào ô liên kết và nội
              dung mà bạn mong muốn xác minh vào ô nội dung
            </RkText>
            <View style={tw.pY4}>
              <FormGroup
                type={CONSTANTS.TEXT}
                value={this.state.lienket}
                editable={true}
                placeholder="Liên kết"
                onChangeText={(id, value) => this.setState({ lienket: value })}
              />
              <FormGroup
                type={CONSTANTS.TEXT_AREA}
                value={this.state.noidung}
                required={true}
                editable={true}
                placeholder="Nội dung"
                onChangeText={(id, value) => this.setState({ noidung: value })}
                containerStyle={tw.mT1}
              />
              <View style={[tw.flexRow, tw.mT1]}>
                <GradientButton
                  text={I18n.t('attached_file')}
                  style={styleContainer.buttonGradient}
                  onPress={this.pickDocument}
                />
                <View style={tw.w1} />
                <GradientButton
                  text={I18n.t('attached_image')}
                  style={styleContainer.buttonGradient}
                  onPress={this.showActionSheet}
                />
              </View>
              <Files
                files={files}
                deleteFile={true}
                deleteFileFunc={this.deleteFileFunc}
              />
              <Gallery
                items={images}
                deleteImg={true}
                navigation={this.props.navigation}
                deleteImgFunc={this.deleteImgFunc}
              />
            </View>
            <GradientButton
              text="Gửi yêu cầu"
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
