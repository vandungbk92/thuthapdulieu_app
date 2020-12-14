import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import { styleContainer } from "../../stylesContainer";
import { checkValidate, clone, convertFiles, convertImagesGallery, isEmpty, showToast } from "../../epics-reducers/services/common";
import { CONSTANTS } from "../../constants"
import { uploadFiles, uploadImages } from "../../epics-reducers/services/fileImageServices";
import { getById, getAll, add, delById, updateById } from "../../epics-reducers/services/hoidapServices";
import { RkText, RkButton } from "react-native-ui-kitten"
import { Ionicons } from "@expo/vector-icons";
import { KittenTheme } from "../../../config/theme";
import GradientButton from "../base/gradientButton"
import { connect } from "react-redux"
import FormGroup from "../base/formGroup";
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { Gallery } from "../base/gallery";
import { Files } from "../base/files";
import I18n from '../../utilities/I18n';
import {LOGIN_PAGE, VIEW_IMAGE_PAGE, IMAGE_BROWSER_PAGE, HOI_DAP_PAGE} from "../../constants/router";
import { PLATFORM_IOS } from "../../constants/variable";
import Space from "../base/space";
import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';
import {Button} from "react-native-elements";

class HoiDap extends Component {
  static navigationOptions = ({ navigation }) => {
    let { params } = navigation.state
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>{'Hỏi đáp ATTT'}</RkText>
      ),
      headerRight: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => params && params.postData ? params.postData() : null}>
          <Ionicons name="ios-send" size={25} color={KittenTheme.colors.appColor} />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = ({
      cauhoi: '',

      files: [],
      imagesGallery: [],
      imageUpload: [],
      fileUpload: [],

    });
  }

  componentWillMount() {
    this.props.navigation.setParams({
      postData: () => this.postData()
    })
  }

  componentDidUpdate(prevProps, prevState) {

  }

  async postData() {
    let dataValidate = [
      { type: CONSTANTS.REQUIRED, value: this.state.cauhoi, alert: "Nội dung" }
    ]
    if (!checkValidate(dataValidate)) return
    let data = {
      cauhoi: this.state.cauhoi
    }

    if (this.state.fileUpload.length) {
      let files = await uploadFiles(this.state.fileUpload)
      data.files = files
    }
    if (this.state.imageUpload.length) {
      let images = await uploadImages(this.state.imageUpload);
      data.hinhanh = images
    }
    let request = await add(data)

    if (request) {
      showToast(I18n.t("add_data_sucess"))
      this.props.navigation.state.params.onGoBack()
      PLATFORM_IOS ? setTimeout(() => this.props.navigation.goBack(null), 501) : this.props.navigation.goBack(null)
    }

  }

  showActionSheet = () => {
    this.ActionSheet.show()
  }

  toggleModal(index) {
    switch (index) {
      case 0:
        break
      case 1:
        this.ActionSheet.hide()
        setTimeout(() => this.pickImage(), 10);
        break;
      case 2:
        this.ActionSheet.hide()
        setTimeout(() => this.pickCamera(), 10);
        break
      case 3:
        this.props.navigation.navigate(VIEW_IMAGE_PAGE, { images: this.state.imagesGallery })
        break
      default:
        break
    }
  }

  async pickImage() {
    if (this.state.disable) return
    let {imagesGallery} = this.state
    const { status: statusCamera } = await Permissions.askAsync(Permissions.CAMERA)
    const { status: statusCameraRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (statusCamera === "granted" && statusCameraRoll === "granted") {
      this.props.navigation.navigate(IMAGE_BROWSER_PAGE, {
        max: 5,
        total_exits: imagesGallery ? imagesGallery.length : 0,
        onGoBack: (callback) => this.imageBrowserCallback(callback)
      })
    } else {
      showToast(I18n.t("please_allow_the_application_to_access_memory"))
      return
    }
  }

  async pickCamera() {
    if (this.state.disable) return
    const { status: statusCamera } = await Permissions.askAsync(Permissions.CAMERA)
    const { status: statusCameraRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (statusCamera === "granted" && statusCameraRoll === "granted") {
      let result = await ImagePicker.launchCameraAsync({});
      if (!result.cancelled) {
        let { imageUpload, imagesGallery } = this.state
        this.setState({
          imageUpload: [...imageUpload, result],
          imagesGallery: [...imagesGallery, ...convertImagesGallery([result])],
          imageChanged: true
        });
      }
    } else {
      showToast(I18n.t("please_allow_the_application_to_access_camera"))
      return
    }
  }

  async pickDocument() {
    if (this.state.disable) return

    let {files} = this.state
    let total_files = 5

    if(Array.isArray(files) && files.length === total_files){
      showToast(I18n.t("maximum_number_files").format(total_files))
      return
    }

    const result = await DocumentPicker.getDocumentAsync({
      //type: 'application/*',
      copyToCacheDirectory: false
    });

    if (result.type !== "cancel") {
      let fileNameSplit = result.name.split(".")
      let fileType = fileNameSplit[fileNameSplit.length - 1]
      if (fileType !== 'doc' && fileType !== 'docx' && fileType !== 'pdf' && fileType !== 'xls' && fileType !== 'xlsx') {
        showToast(I18n.t("inappropriate_file_format"))
        return
      }
      if (result.size >= CONSTANTS.LIMIT_SIZE_OF_FILE) {
        showToast(I18n.t("beyond_the_allowed_capacity").format(CONSTANTS.LIMIT_SIZE_OF_FILE / 1000000))
        return
      }
      let { files, fileUpload } = this.state
      this.setState({
        files: [...files, ...convertFiles([result])],
        fileUpload: [...fileUpload, result]
      });
    }
  }

  imageBrowserCallback(callback) {
    if (callback === CONSTANTS.REJECT) {
      return
    }

    let { imageUpload, imagesGallery } = this.state


    callback.then((photos) => {
      this.setState({
        imageUpload: [...imageUpload, ...photos],
        imagesGallery: [...imagesGallery, ...convertImagesGallery(photos)],
        imageChanged: true
      })
    }).catch((e) => null)
  }

  changeElement(id, value) {
    this.setState({[id]: value})
  }

  async deleteFileFunc(file) {
    let { files, fileUpload } = this.state

    fileUpload = fileUpload.filter(data => {
      return data.name !== file.name
    })

    // cập nhật file request
    files = files.filter(data => {
      return data.name !== file.name
    })

    this.setState({
      files: files,
      fileUpload: fileUpload
    })
  }

  async deleteImgFunc(uri) {

    let { imagesGallery, imageUpload } = this.state

    imagesGallery = imagesGallery.filter(data => {
      return data.source.uri !== uri
    })

    imageUpload = imageUpload.filter(data => {
      return data.file !== uri
    })

    this.setState({
      imageUpload: imageUpload,
      imagesGallery: imagesGallery
    })

  }

  render() {

    let { request, files, imagesGallery } = this.state
    let checkImage = !!(imagesGallery && imagesGallery.length)
    let options = [
      <RkText>{I18n.t("reject")}</RkText>,
      <RkText><Ionicons style={{ flex: 1 }} name="ios-folder" size={20} color={KittenTheme.colors.appColor} />
        <Space />{I18n.t("select_photos_from_the_device")}
      </RkText>,
      <RkText><Ionicons style={{ flex: 1 }} name="ios-camera" size={20} color={KittenTheme.colors.appColor} />
        <Space />{I18n.t("take_a_photo")}
      </RkText>
    ]
    if (checkImage) {
      options.push(<RkText><Ionicons style={{ flex: 1 }} name="ios-eye" size={20} color={KittenTheme.colors.appColor} />
        <Space />{I18n.t("view_photo")}
      </RkText>)
    }


    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailContent}>
          <KeyboardAwareScrollView>
            <RkText rkType="header5" style={styles.title}>{I18n.t("Thông tin câu hỏi")}</RkText>

            <FormGroup type={CONSTANTS.TEXT_AREA}
                       required={true}
                       editable={true}
                       id="cauhoi"
                       backgroundColor="transparent"
                       placeholder={I18n.t("content")}
                       value={this.state.cauhoi}
                       onChangeText={(id, value) => this.changeElement(id, value)}
            />


            <View style={styles.buttonGroup}>
              <View style={{ flex: 1 }}>
                <GradientButton
                  style={styleContainer.buttonGradient}
                  text={I18n.t("attached_image")}
                  onPress={this.showActionSheet.bind(this)} />
              </View>
              <RkText>{" "}</RkText>
              <View style={{ flex: 1 }}>
                <GradientButton
                  style={styleContainer.buttonGradient}
                  text={I18n.t("attached_file")}
                  onPress={this.pickDocument.bind(this)} />
              </View>
            </View>

            <ActionSheet
              ref={o => this.ActionSheet = o}
              options={options}
              cancelButtonIndex={0}
              destructiveButtonIndex={4}
              onPress={(index) => this.toggleModal(index)}
            />

            <Files files={files} deleteFile={true} deleteFileFunc={this.deleteFileFunc.bind(this)} />

            <Gallery navigation={this.props.navigation}
                     items={imagesGallery} deleteImg={true} deleteImgFunc={this.deleteImgFunc.bind(this)} />
          </KeyboardAwareScrollView>

          {/*<View style={{ alignContent: 'center', alignItems: 'center', paddingTop: 10 }}>
            <RkButton style={{paddingHorizontal: 5}} rkType='success' onPress={this.postData.bind(this)}>{I18n.t("save_data")}</RkButton>
          </View>*/}
        </View>

        <View style={styles.button}>
          <Button
            containerViewStyle={{width: 150}}
            borderRadius={16}
            icon={{
              name: "save",
              size: 15,
              color: "white"
            }}
            backgroundColor={'#007bff'}
            title={"Lưu dữ liệu"}
            onPress={this.postData.bind(this)}
          />
        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: KittenTheme.colors.white,
    flex: 1
  },
  viewContainer: {
    flexDirection: "column",
    backgroundColor: KittenTheme.colors.white,
    marginBottom: 5,
    borderRadius: KittenTheme.border.borderRadius,
    borderColor: KittenTheme.border.borderColor,
    borderWidth: KittenTheme.border.borderWidth,
    padding: 5
  },
  detailContent: {
    padding: 10,
    flex: 1
  },
  title: { marginBottom: 5 },
  tooltip: {fontSize: 10, color: 'blue'},
  buttonGroup: { flexDirection: 'row' },
  citizenInfo: { marginTop: 20 },
  button: {
    position: 'absolute',
    bottom:0,
    marginBottom: 5,
    borderRadius: 16,
    // backgroundColor: 'red',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

function mapStateToProps(state) {
  const { loginRes, userInfoRes, districtsRes, unitsRes, servicesRes } = state
  return { loginRes, userInfoRes, districtsRes, unitsRes, servicesRes }
}

HoiDap.defaultProps = {
  language: 'vi'
};

export default connect(mapStateToProps)(HoiDap);
