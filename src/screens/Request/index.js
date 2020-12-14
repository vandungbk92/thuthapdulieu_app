import React, {Component} from "react";
import {RkText} from "react-native-ui-kitten"
import {View, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet} from "react-native";

import Constants from 'expo-constants';
import {styles} from "./styles";
import {styleContainer} from "../../stylesContainer";
import {CONSTANTS} from "../../constants";
import {VIEW_IMAGE_PAGE} from "../../constants/router";
import {getAllRequest, getRequestById, getMyRequestById} from "../../epics-reducers/services/requestServices";
import {
  convertFiles,
  convertImagesGallery,
  convertImages,
  clone,
  isEmpty,
  search,
  convertDataService,
  checkValidate,
  showToast,
  checkStatusRequest, convertUnitData, formatString
} from "../../epics-reducers/services/common";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {KittenTheme} from "../../../config/theme";
import {connect} from "react-redux"
import axios from "axios"
import FormGroup from "../base/formGroup";
import RatingStar from "../base/ratingStar";
import {Gallery} from "../base/gallery";
import {Files} from "../base/files";
import CommentRequest from "../base/commentRequest";
import I18n from '../../utilities/I18n';
import Space from "../base/space";
import MapNative from "../base/mapSelectMarker/MapNative";
import Required from "../base/required";
import {ASPECT_RATIO, DEVICE_HEIGHT, DEVICE_WIDTH} from "../../constants/variable";
import {timeFormatter} from '../../constants/dateFormat'
import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';

class Request extends Component {
  static navigationOptions = ({navigation}) => {
    let {params} = navigation.state
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText}/>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>{I18n.t('info_detail')}</RkText>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = ({
      request: {},
      files_req: [],
      files_public: [],
      images_public: [],
      imagesReqGallery: [],
      imagesPublicGallery: [],
      isModalVisible: false,
      isModalPublicVisible: false,
      files: [],
      images: [],
      data: null
    })
  }

  async componentDidMount() {
    try {
      let {id} = this.props.navigation.state.params
      let {userInfoRes} = this.props
      let apiRequest = this.props.navigation.state.params.type === 'MY_REQUESTS' ? [await getMyRequestById(id, userInfoRes.phone)] : [await getRequestById(id)]

      let request
      let apiResponse = await axios.all(apiRequest).then(axios.spread(function (request) {
        return {
          request: request
        }
      }));
      request = apiResponse.request

      let files_req = convertFiles(request.files_req)
      let imagesReqGallery = convertImagesGallery(request.images_req)
      let files_public = convertFiles(request.files_public)
      let images_public = convertImages(request.images_public)
      let imagesPublicGallery = convertImagesGallery(request.images_public)

      this.setState({
        request,
        files_req,
        files_public,
        images_public,
        imagesReqGallery,
        imagesPublicGallery
      })
    } catch (error) {

    }
  }

  handleSelected(id, data) {
    if (id === 'dataRepresentSel' || id === 'unitSel') {
      this.changeSelection(id, data)
    } else {
      this.state[id] = [data[0]._id]
      this.setState(this.state)
    }

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
    let {request, files_req, files_public, imagesReqGallery, imagesPublicGallery, disable} = this.state

    let checkImageReq = !!(imagesReqGallery && imagesReqGallery.length)
    let checkPublic = request.isPublic
    let statusReq
    if (request) {
      statusReq = checkStatusRequest(request.confirmed, request.isPublic)
    }

    let options = [
      <RkText>{I18n.t("reject")}</RkText>,
      <RkText><Ionicons style={{flex: 1}} name="ios-folder" size={20} color={KittenTheme.colors.appColor}/>
        <Space/>{I18n.t("select_photos_from_the_device")}
      </RkText>,
      <RkText><Ionicons style={{flex: 1}} name="ios-camera" size={20} color={KittenTheme.colors.appColor}/>
        <Space/>{I18n.t("take_a_photo")}
      </RkText>
    ]
    if (checkImageReq) {
      options.push(<RkText><Ionicons style={{flex: 1}} name="ios-eye" size={20} color={KittenTheme.colors.appColor}/>
        <Space/>{I18n.t("view_photo")}
      </RkText>)
    }

    let dataMap = {}
    let initData = false
    let showMap = false
    if (request && Object.keys(request).length) {
      showMap = (this.props.navigation.state.params.type === 'VIEW' && request && request.use_maps)
        || (this.props.navigation.state.params.type === 'MY_REQUESTS' && (this.state.editable || (!this.state.editable && request && request.use_maps)))
    }

    if (request.use_maps) {
      initData = true
      dataMap = {
        latitude: request.latitude,
        longitude: request.longitude,
        latitudeDelta: 15,
        longitudeDelta: 15 * ASPECT_RATIO
      }
    }
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={{backgroundColor: KittenTheme.colors.blueGray_1}}>
            <ScrollView style={styles.screen}>
              <View style={[styles.block]}>
                <RkText rkType="header5">{I18n.t("request_detail")}</RkText>
                <View style={[styles.containerTitle]}>
                  <FormGroup type={CONSTANTS.TEXT}
                             readOnly={true}
                             editable={this.state.editable}
                             id="created_at"
                             backgroundColor="transparent"
                             placeholder={I18n.t("feedback_date")}
                             value={timeFormatter(request.created_at)}
                             labelIcon={<MaterialCommunityIcons name="clock" size={20}
                                                                color={KittenTheme.colors.appColor}/>}
                  />

                  <FormGroup type={CONSTANTS.TEXT}
                             readOnly={true}
                             editable={this.state.editable}
                             id="created_at"
                             backgroundColor="transparent"
                             placeholder={'Lĩnh vực'}
                             value={request.service_id ? request.service_id.name : ''}
                  />

                  <FormGroup type={CONSTANTS.TEXT_AREA}
                             required={true}
                             readOnly={true}
                             editable={this.state.editable}
                             id="title"
                             backgroundColor="transparent"
                             placeholder={I18n.t("title")}
                             value={request.title}
                             numberOfLines={2}
                  />

                  <FormGroup type={CONSTANTS.TEXT_AREA}
                             required={true}
                             readOnly={true}
                             editable={true}
                             id="content"
                             backgroundColor="transparent"
                             placeholder={I18n.t("content")}
                             value={request.content}
                  />

                  <View style={[stylesMaps.viewContainer, styleContainer.boxShadow]}>
                    <RkText rkType="primary2">{I18n.t("location")}{this.state.editable && <Required required={true}/>}
                      {showMap && <RkText rkType=""
                                          style={stylesMaps.tooltip}>{request.use_maps ? ' Vị trí trên bản đồ' : ' Vị trí không định vị trên bản đồ'}</RkText>}
                    </RkText>

                    {
                      request && Object.keys(request).length ? <MapNative getData={this.getData.bind(this)}
                                                                          disableMap={!this.state.editable}
                                                                          showMap={showMap}
                                                                          initData={initData}
                                                                          dataMap={dataMap}
                                                                          address={request.address}
                                                                          height={DEVICE_HEIGHT / 3}
                                                                          width={DEVICE_WIDTH - 30}/> : null
                    }


                  </View>


                  <Files files={files_req}/>

                  <Gallery navigation={this.props.navigation}
                           items={imagesReqGallery}
                  />

                </View>
              </View>

              {!this.state.editable ? (checkPublic ?
                <View style={[styles.block]}>
                  <RkText rkType="header5">{I18n.t("processing_results")}</RkText>
                  <View style={[styles.containerTitle]}>
                    <FormGroup type={CONSTANTS.TEXT}
                               readOnly={true}
                               editable={this.state.editable}
                               id="date_public"
                               backgroundColor="transparent"
                               placeholder={I18n.t("processing_date")}
                               value={timeFormatter(request.date_public)}
                               labelIcon={<MaterialCommunityIcons name="clock" size={20}
                                                                  color={KittenTheme.colors.appColor}/>}
                    />
                    {
                      request.public_user_id && request.public_user_id.unit_id ?
                        <FormGroup type={CONSTANTS.TEXT_AREA}
                                   readOnly={true}
                                   editable={this.state.editable}
                                   id="public_user_id"
                                   backgroundColor="transparent"
                                   placeholder={I18n.t("processing_unit")}
                                   value={request.public_user_id.unit_id.name}
                        /> : null
                    }

                    <FormGroup type={CONSTANTS.TEXT_AREA}
                               readOnly={true}
                               editable={this.state.editable}
                               id="content"
                               backgroundColor="transparent"
                               placeholder={I18n.t("content")}
                               value={request.content_public}
                    />

                    <Files files={files_public}/>
                    <Gallery navigation={this.props.navigation} items={imagesPublicGallery}/>
                  </View>
                </View> :
                <View style={[styles.block]}>
                  {request.confirmed !== 0 && <View>
                    <RkText rkType="header5">{I18n.t("processing_status")}</RkText>
                    <View style={[styles.containerTitle, {alignItems: "center"}]}>
                      <RkText>{statusReq ? statusReq.name : ''}</RkText>
                    </View>
                  </View>}
                  {/* Keets qua xu ly */}
                  {request.confirmed === 0 && <View>
                    <RkText rkType="header4">{I18n.t("processing_results")}</RkText>
                    <View style={[styles.containerTitle, {alignItems: "center"}]}>
                      <RkText
                        style={[styles.desciptionText, styleContainer.sizeTextNormal]}>{I18n.t('refuse_to_process')}</RkText>
                      <FormGroup type={CONSTANTS.TEXT_AREA}
                                 readOnly={true}
                                 id="content_public"
                                 backgroundColor="transparent"
                                 placeholder={I18n.t("reason")}
                                 value={request.content_public}
                      />
                    </View>
                  </View>}
                </View>) : null}

              <View style={[styles.block]}>
                <RkText rkType="header4">{checkPublic ? I18n.t("review_comment") : I18n.t("comment")}</RkText>
                <View style={{marginTop: 5}}>
                  {checkPublic &&
                  <RatingStar requestId={this.props.navigation.state.params.id} navigation={this.props.navigation}/>}
                  <CommentRequest requestId={this.props.navigation.state.params.id} navigation={this.props.navigation}/>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const stylesMaps = StyleSheet.create({
  container: {
    flex: 1,
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
  tooltip: {fontSize: 10, color: 'blue'}
});

function mapStateToProps(state) {
  const {userInfoRes, servicesRes, districtsRes, unitsRes} = state
  return {userInfoRes, servicesRes, districtsRes, unitsRes}
}

export default connect(mapStateToProps)(Request);

