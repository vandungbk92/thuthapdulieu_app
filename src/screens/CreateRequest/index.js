import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import { styleContainer } from "../../stylesContainer";
import { fetchUnitsRequest } from '../../epics-reducers/fetch/fetch-units.duck';
import { checkValidate, clone, convertFiles, convertImagesGallery, isEmpty, showToast, convertUnitData, formatString } from "../../epics-reducers/services/common";
import { CONSTANTS, DATA_LAT_LONG } from "../../constants"
import { uploadFiles, uploadImages } from "../../epics-reducers/services/fileImageServices";
import { createRequest } from "../../epics-reducers/services/requestServices";
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
import { LOGIN_PAGE, VIEW_IMAGE_PAGE, IMAGE_BROWSER_PAGE } from "../../constants/router";
import { PLATFORM_IOS, DEVICE_HEIGHT, DEVICE_WIDTH } from "../../constants/variable";
import Space from "../base/space";
import MapNative from "../base/mapSelectMarker/MapNative";

import Required from "../base/required";
import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';
import {fetchServicesRequest} from "../../epics-reducers/fetch/fetch-services.duck";

class CreateRequest extends Component {
  static navigationOptions = ({ navigation }) => {
    let { params } = navigation.state
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>{I18n.t("create_feedback")}</RkText>
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
      request: {
        isPublic: false,
        citizen_id: "",
        title: "",
        content: "",
        address: ""
      },
      citizen: {},
      files: [],
      imagesGallery: [],
      imageUpload: [],
      fileUpload: [],
      isModalVisible: false,
      unitData: [],
      unitSel: [],
      serviceData: [],
      serviceSel: []
    });
    this.handlePostData = this.handlePostData.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      postData: () => this.postData()
    })
  }

  async componentDidMount() {
    try {
      const { dispatch, servicesRes, unitsRes } = this.props;
      if (!unitsRes) {
        dispatch(fetchUnitsRequest());
      } else {
        let unitData = convertUnitData(unitsRes)
        this.setState({ unitData });
      }

      if (!servicesRes) {
        dispatch(fetchServicesRequest());
      } else {
        let serviceData = convertUnitData(servicesRes)
        this.setState({ serviceData });
      }

    } catch (error) {
      showToast(I18n.t("show_error"))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { unitsRes, servicesRes  } = this.props;
    if (unitsRes !== prevProps.unitsRes && unitsRes && Array.isArray(unitsRes)) {
      let unitData = convertUnitData(unitsRes)
      this.setState({ unitData });
    }

    if (servicesRes !== prevProps.servicesRes && servicesRes && Array.isArray(servicesRes)) {
      let serviceData = convertUnitData(servicesRes)
      this.setState({ serviceData });
    }

  }

  async postData() {
    let { userInfoRes } = this.props
    let dataValidate = [
      { type: CONSTANTS.REQUIRED, value: this.state.serviceSel && this.state.serviceSel.length ? this.state.serviceSel[0] : '', alert: 'Chủ đề' },
      { type: CONSTANTS.REQUIRED, value: this.state.request.address, alert: I18n.t("location") },
      { type: CONSTANTS.REQUIRED, value: this.state.request.title, alert: I18n.t("title") },
      { type: CONSTANTS.REQUIRED, value: this.state.request.content, alert: I18n.t("content") }
    ]
    if (!checkValidate(dataValidate)) return

    let data = clone(this.state.request)

    if (userInfoRes && userInfoRes._id) {
      data.full_name = userInfoRes.full_name
      data.phone = userInfoRes.phone
      data.email = userInfoRes.email
    } else {
      dataValidate = [
        { value: this.state.citizen.full_name, type: CONSTANTS.REQUIRED, alert: I18n.t("full_name") },
        { value: this.state.citizen.phone, type: CONSTANTS.PHONE, alert: I18n.t("phone") }
      ]
      if (!checkValidate(dataValidate)) return

      data.full_name = this.state.citizen.full_name
      data.phone = this.state.citizen.phone
      data.email = this.state.citizen.email
    }

    data.service_id = this.state.serviceSel[0]
    data.unit_responsible_id = this.state.unitSel[0]

    if(data.use_maps){
      let dataMap = await this.getAddress(data.latitude, data.longitude)
      if (this.handleCheckProvince(dataMap.province)) return;
      data.district = dataMap.district
    }

    this.handlePostData(data, this.state.fileUpload, this.state.imageUpload)
  }

  handleCheckProvince(province) {
    if (formatString(province) !== formatString('Thanh Hoá')) {
      showToast('Vui lòng chọn vị trí trong tỉnh Thanh Hóa')
      return true;
    }
    return false;
  }


  getAddress(lat, lng) {
    return fetch(`${'https://maps.googleapis.com/maps/api/geocode/json?latlng='}${lat}${','}${lng}${'&sensor=true&language='}${this.props.language}${'&key='}${CONSTANTS.GOOGLE_API_KEY}`, {
      method: "GET",
    })
      .then(response => {
        return response.json()
      })
      .then(res => {
        let results = res.results
        let address_components = results[0].address_components
        let district = ""
        let province = ''

        if(Array.isArray(address_components)){
          address_components.map(item => {
            if (item.types.indexOf('administrative_area_level_2') !== -1 || item.types.indexOf('locality') !== -1) {
              district = item.long_name
            }

            if (item.types.indexOf('administrative_area_level_1') !== -1) {
              province = item.long_name;
            }
          })
        }
        if(district === "Thị xã Sầm Sơn") district = "Thành phố Sầm Sơn"
        else if(district === "Thành phố Thanh Hoá") district = "Thành phố Thanh Hóa"
        return {district: district, province: province}
      })
      .catch(err => {
        return null
      })
  }

  async handlePostData(data, fileUpload, imageUpload) {
    if (this.state.fileUpload.length) {
      let files = await uploadFiles(this.state.fileUpload)
      let _files = []
      files.map(file => {
        _files.push(file.image_id)
      })
      data.files_req = _files
    }
    if (this.state.imageUpload.length) {
      let images = await uploadImages(this.state.imageUpload);
      let _images = []
      images.map(image => {
        _images.push(image.image_id)
      })
      data.images_req = _images
    }
    let request = await createRequest(data)

    if (request) {
      showToast(I18n.t("add_data_sucess"))
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

  changeElement(id, event) {
    this.state.request[id] = event
    this.setState(this.state)
  }

  changeCitizenElement(id, event) {
    this.state.citizen[id] = event
    this.setState(this.state)
  }


  handleSelected(id, data) {
    this.state[id] = [data[0]._id]
    this.setState(this.state)
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

  onPressLogin() {
    this.props.navigation.navigate(LOGIN_PAGE)
  }

  getData(address, lat, long, use_maps) {
    let {request} = this.state
    request.address = address
    request.latitude = lat
    request.longitude = long
    request.use_maps = use_maps
    this.setState({request})
  }

  render() {

    let { request, citizen, files, imagesGallery } = this.state
    let { userInfoRes } = this.props
    let citizenInfo = citizen
    let checkLogin = false
    if(userInfoRes && userInfoRes._id){
      citizenInfo = userInfoRes
      checkLogin = true
    }
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
        <KeyboardAwareScrollView>
          <View style={styles.detailContent}>
            <RkText rkType="header5" style={styles.title}>{I18n.t("request_detail")}</RkText>

            <FormGroup type={CONSTANTS.SELECT}
                       required={true}
                       selectText={'Chủ đề'}
                       id="serviceSel"
                       value={this.state.serviceData}
                       selectedItems={this.state.serviceSel}
                       single={true}
                       showCancelButton={true}
                       subKey={"children"}
                       onSelectedItemsChange={(id, data) => this.handleSelected(id, data)}
                       onConfirm={(id, data) => this.handleSelected(id, data)}
                       onCancel={(id, data) => this.setState({ serviceSel: this.state.serviceSel })}
            />

            <FormGroup type={CONSTANTS.SELECT}
              required={false}
              selectText={I18n.t("receiving_unit")}
              id="unitSel"
              value={this.state.unitData}
              selectedItems={this.state.unitSel}
              single={true}
              showCancelButton={true}
              subKey={"children"}
              onSelectedItemsChange={(id, data) => this.handleSelected(id, data)}
              onConfirm={(id, data) => this.handleSelected(id, data)}
              onCancel={(id, data) => this.setState({ unitSel: this.state.unitSel })}
            />

            <FormGroup type={CONSTANTS.TEXT_AREA}
              required={true}
              editable={true}
              id="title"
              backgroundColor="transparent"
              placeholder={I18n.t("title")}
              value={request.title}
              numberOfLines={2}
              onChangeText={(id, value) => this.changeElement(id, value)}
            />

            <FormGroup type={CONSTANTS.TEXT_AREA}
              required={true}
              editable={true}
              id="content"
              backgroundColor="transparent"
              placeholder={I18n.t("content")}
              value={request.content}
              onChangeText={(id, value) => this.changeElement(id, value)}
            />

            <View style={[styles.viewContainer, styleContainer.boxShadow]}>
              <RkText rkType="primary2 disabled" >{I18n.t("location")}<Required required={true} />
                <RkText rkType="" style={styles.tooltip}>{request.use_maps ? ' Vị trí trên bản đồ' : ' Vị trí không định vị trên bản đồ'}</RkText>
              </RkText>

              <MapNative getData={this.getData.bind(this)} showMap={true} initData={false}
                        height={DEVICE_HEIGHT / 3} width={DEVICE_WIDTH - 30}/>
            </View>

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

            <View>
              <View>
                <RkText rkType="header5" style={styles.title}>{I18n.t("information_sender_feedback")}</RkText>

                <FormGroup type={CONSTANTS.TEXT}
                           required={true}
                           editable={true}
                           readOnly={checkLogin}
                           id="full_name"
                           backgroundColor="transparent"
                           placeholder={I18n.t("full_name")}
                           value={citizenInfo.full_name}
                           onChangeText={(id, value) => this.changeCitizenElement(id, value)}
                />

                <FormGroup type={CONSTANTS.TEXT}
                           required={true}
                           editable={true}
                           readOnly={checkLogin}
                           id="phone"
                           backgroundColor="transparent"
                           placeholder={I18n.t("phone")}
                           value={citizenInfo.phone}
                           onChangeText={(id, value) => this.changeCitizenElement(id, value)}
                />

                <FormGroup type={CONSTANTS.TEXT}
                           required={false}
                           editable={true}
                           readOnly={checkLogin}
                           id="email"
                           backgroundColor="transparent"
                           placeholder={I18n.t("email")}
                           value={citizenInfo.email}
                           onChangeText={(id, value) => this.changeCitizenElement(id, value)}
                />
              </View>

            </View>

            <View style={{ alignContent: 'center', alignItems: 'center', paddingTop: 10 }}>
              <RkButton style={{paddingHorizontal: 5}} rkType='success' onPress={this.postData.bind(this)}>{I18n.t("save_data")}</RkButton>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: KittenTheme.colors.white,
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
  },
  title: { marginBottom: 5 },
  tooltip: {fontSize: 10, color: 'blue'},
  buttonGroup: { flexDirection: 'row' },
  citizenInfo: { marginTop: 20 }
});

function mapStateToProps(state) {
  const { loginRes, userInfoRes, districtsRes, unitsRes, servicesRes } = state
  return { loginRes, userInfoRes, districtsRes, unitsRes, servicesRes }
}

CreateRequest.defaultProps = {
  language: 'vi'
};

export default connect(mapStateToProps)(CreateRequest);
