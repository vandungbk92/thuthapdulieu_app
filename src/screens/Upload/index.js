import React from "react";

import {Camera} from "expo-camera";
import {TouchableOpacity, View, LogBox} from "react-native";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {RkText, RkTextInput} from "react-native-ui-kitten";
import * as ImagePicker from 'expo-image-picker';
import {tw} from "react-native-tailwindcss";
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import {connect} from "react-redux";
import {Audio} from "expo-av";
import {styleContainer} from "../../stylesContainer";
import {KittenTheme} from "../../../config/theme";
import I18n from "../../utilities/I18n";

import {convertImagesGallery, showToast} from "../../epics-reducers/services/common";
import GradientButton from '../base/gradientButton';
import {Gallery} from '../base/gallery';
import FormGroup from "../base/formGroup";
import {CONSTANTS} from "../../constants";

import { IMAGE_BROWSER_PAGE, VIEW_IMAGE_PAGE, VIDEO_PAGE, AUDIO_PAGE } from "../../constants/router";
import { postImages } from "../../epics-reducers/services/fileServices";
import { getUserInfo } from "../../epics-reducers/services/userServices";
import { create } from "../../epics-reducers/services/quanlydulieuServices";
import moment from 'moment';

class UploadScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
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
          Màn hình upload
        </RkText>
      ),
      headerRight: () => {
        return(
            <TouchableOpacity
                style={styleContainer.headerButton}
                onPress={navigation.getParam('onFormSubmit')}
            >
                <RkText rkType="link">Lưu</RkText>
            </TouchableOpacity>
        )
      }
    };
  };

    constructor(props) {
      super(props);
      this.state = {
        ghichu: "",
        tendulieu: "",
        userInfo: {},
        images: [],
        imagesUpload: [],
        videos: null
      };
      this.actionSheet = React.createRef();
      props.navigation?.setParams({onFormSubmit: this.onFormSubmit});
    }

    async componentDidMount() {
      LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
      let userInfo = await getUserInfo()
      if (userInfo) {
        this.setState({userInfo})
      } 
    }

    async pickImage() {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showToast(I18n.t('please_allow_the_application_to_access_memory'));
        return;
      }

      this.props.navigation.navigate(IMAGE_BROWSER_PAGE, {
        max: 5,
        total_exits: this.state.images ? this.state.images.length : 0,
        onGoBack: (callback) => this.imageBrowserCallback(callback),
      });
    }

    async pickCamera() {
      const {status} = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
          showToast(I18n.t('please_allow_the_application_to_access_camera'));
          return;
      }
      const result = await ImagePicker.launchCameraAsync({});
      if (!result.cancelled) {
        this.setState((state) => ({
            images: [...state.images, ...convertImagesGallery([result])],
            imagesUpload: [...state.imagesUpload, result],
        }));
      }
  }

    async pickVideo() {
      const { tendulieu, ghichu} = this.state;

      const {status} = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showToast(I18n.t('please_allow_the_application_to_access_camera'));
        return;
      }
        this.props.navigation.navigate(VIDEO_PAGE, {maNhanvien: this.state.userInfo?._id, tendulieu, ghichu});
    }

    async showRecordScreen() {
      const { tendulieu, ghichu} = this.state;
      const {status} = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        showToast(I18n.t('please_allow_the_application_to_access_camera'));
        return;
      }
        this.props.navigation.navigate(AUDIO_PAGE, {status: status, maNhanvien: this.state.userInfo?._id, tendulieu, ghichu});
    }

    showActionSheet = () => {
      this.actionSheet.current?.show();
    };

    onFormSubmit = async () => {
      const currentTime = moment().toISOString();
      if (this.state.imagesUpload.length && this.state.userInfo?._id) {
        const images = await postImages(this.state.imagesUpload, this.state.userInfo?._id, currentTime);
        if(images) {
          showToast('Tải ảnh thành công!');
          let arrNameImage = [];
          images.forEach(image => {
            const objFiles = JSON.parse(image.body).files;
            const arrFilesName = objFiles?.files.map(e => e.filename);
            arrNameImage.push(arrFilesName[0]);
          });
          const params = {
              hinhanh: arrNameImage,
              nhanvien_id: this.state.userInfo._id,
              ngayupload: currentTime
          }
          const a = await create(params);
        }

        this.setState({
          images: [],
          imagesUpload: [],
          videos: null
        })
      }else{
        showToast('Vui lòng nhập đủ dữ liệu!');
      }
    }

    onActionPress = (index) => {
      switch (index) {
        case 1:
          this.actionSheet.current?.hide();
          setTimeout(() => this.pickImage(), 10);
          break;

        case 2:
          this.actionSheet.current?.hide();
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

    deleteImgFunc = async (uri) => {
      const {images, imagesUpload} = this.state;

      const newImages = images.filter((data) => {
        return data.source.uri !== uri;
      });
      const newImagesUpload = imagesUpload.filter((data) => {
        return data.file !== uri;
      });

      this.setState({
        images: newImages,
        imagesUpload: newImagesUpload,
      });
    }

    imageBrowserCallback(callback) {
      if (callback === CONSTANTS.REJECT) {
        return;
      }

      callback
        .then((photos) => {
          this.setState((state) => ({
            images: [...state.images, ...convertImagesGallery(photos)],
            imagesUpload: [...state.imagesUpload, ...photos],
          }));
        })
        .catch((e) => null);
    }

    render() {
      let {images} = this.state;
      let options = [
        <RkText>{I18n.t('reject')}</RkText>,
        <View style={[tw.flexRow, tw.itemsCenter]}>
          <Ionicons
            name="ios-folder"
            size={20}
            color={KittenTheme.colors.appColor}
          />
          <View style={tw.w1}/>
          <RkText>{I18n.t('select_photos_from_the_device')}</RkText>
        </View>,
        <View style={[tw.flexRow, tw.itemsCenter]}>
          <Ionicons
            name="ios-camera"
            size={20}
            color={KittenTheme.colors.appColor}
          />
          <View style={tw.w1}/>
          <RkText>{I18n.t('take_a_photo')}</RkText>
        </View>
      ];

      if (images && images.length > 0) {
        options.push(
          <View style={[tw.flexRow, tw.itemsCenter]}>
            <Ionicons
              name="ios-eye"
              size={20}
              color={KittenTheme.colors.appColor}
            />
            <View style={tw.w1}/>
            <RkText>{I18n.t('view_photo')}</RkText>
          </View>,
        );
      }

      return(
        <>
          <View style={tw.p4}>
            <FormGroup
              type={CONSTANTS.TEXT}
              value={this.state.tendulieu}
              editable={true}
              placeholder={"Tên dữ liệu"}
              onChangeText={(id, value) => this.setState({tendulieu: value})}
            />
            <FormGroup
              type={CONSTANTS.TEXT}
              value={this.state.ghichu}
              editable={true}
              placeholder={"Ghi chú"}
              onChangeText={(id, value) => this.setState({ghichu: value})}
            />
            <GradientButton 
              text={I18n.t('Ảnh')}
              style={[tw.mT1, styleContainer.buttonGradient]}
              onPress={this.showActionSheet}
            />
            <GradientButton 
              text={I18n.t('Video')}
              style={[tw.mT1, styleContainer.buttonGradient]}
              onPress={() => this.pickVideo()}
            />
            <GradientButton
              text="Record"
              style={[tw.mT1, styleContainer.buttonGradient]}
              onPress={() => this.showRecordScreen()}
            />
            <Gallery
              items={images}
              deleteImg={true}
              navigation={this.props.navigation}
              deleteImgFunc={this.deleteImgFunc}
            />
          </View>
          <ActionSheet
            ref={this.actionSheet}
            options={options}
            onPress={this.onActionPress}
            cancelButtonIndex={0}
            destructiveButtonIndex={4}
          />
        </>
      )
  }
}

export default connect()(UploadScreen);