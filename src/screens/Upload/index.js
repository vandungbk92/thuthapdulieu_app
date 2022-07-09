import React from "react";

import {Camera} from "expo-camera";
import {TouchableOpacity, View, LogBox, SafeAreaView, ScrollView} from "react-native";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {RkText, RkTextInput} from "react-native-ui-kitten";
import * as ImagePicker from 'expo-image-picker';
import {tw} from "react-native-tailwindcss";
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import {connect} from "react-redux";
import {Audio, Video} from "expo-av";
import {styleContainer} from "../../stylesContainer";
import {KittenTheme} from "../../../config/theme";
import I18n from "../../utilities/I18n";

import {convertImagesGallery, showToast} from "../../epics-reducers/services/common";
import GradientButton from '../base/gradientButton';
import {Gallery} from '../base/gallery';
import FormGroup from "../base/formGroup";
import {CONSTANTS} from "../../constants";
import {IMAGE_BROWSER_PAGE, VIEW_IMAGE_PAGE, VIDEO_PAGE, AUDIO_PAGE} from "../../constants/router";
import {postImages} from "../../epics-reducers/services/fileServices";
import {getAllDataset, getUserInfo} from "../../epics-reducers/services/userServices";
import AudioPlay1 from './AudioPlay1'
import {uploadFiles, uploadImages} from "../../epics-reducers/services/fileImageServices";
import {create} from "../../epics-reducers/services/quanlydulieuServices";

class UploadScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
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
        return (
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
      videos: null,
      videoUpload: [],
      audioUpload: [],
      datasetId: "",
      dsDataset: []

    };
    this.actionSheet = React.createRef();
    props.navigation?.setParams({onFormSubmit: this.onFormSubmit});
  }

  async componentDidMount() {
    // LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    let [userInfo, dsDataset] = await Promise.all([
      getUserInfo(),
      getAllDataset(1, 0)
    ])
    if (userInfo || dsDataset) {
      this.setState({
        userInfo: userInfo || {},
        dsDataset: dsDataset.docs || [],
        datasetId: userInfo?.datasetId
      })
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
    const {tendulieu, ghichu} = this.state;

    const {status} = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showToast(I18n.t('please_allow_the_application_to_access_camera'));
      return;
    }
    this.props.navigation.navigate(VIDEO_PAGE, {
      onGoBack: this.onGoBackVideo
    });
  }

  onGoBackVideo = (data) => {
    this.setState({videoUpload: [...this.state.videoUpload, data]})
  }

  async showRecordScreen() {
    const {tendulieu, ghichu} = this.state;
    const {status} = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      showToast(I18n.t('please_allow_the_application_to_access_camera'));
      return;
    }
    this.props.navigation.navigate(AUDIO_PAGE, {
      onGoBack: this.onGoBackAudio
    });
  }

  onGoBackAudio = (data) => {
    this.setState({audioUpload: [...this.state.audioUpload, data]})
  }

  showActionSheet = () => {
    this.actionSheet.current?.show();
  };

  onFormSubmit = async () => {
    try {
      let {videoUpload, imagesUpload, audioUpload} = this.state;
      let hinhanh = [];
      let video = [];
      let audio = [];
      // bước 1 upload ảnh.
      if (imagesUpload.length) {
        hinhanh = await uploadImages(imagesUpload,  this.state.datasetId);
      }
      if(videoUpload.length){
        video = await uploadFiles(videoUpload, 'video', this.state.datasetId);
      }
      if(audioUpload.length){
        audio = await uploadFiles(videoUpload, 'audio', this.state.datasetId);
      }

      let dataReq = {
        datasetId: this.state.datasetId,
        tendulieu: this.state.tendulieu,
        ghichu: this.state.ghichu,
        hinhanh,
        video,
        audio
      }
      let dataRes = await create(dataReq);
      if(dataRes){
        console.log(dataRes, 'dataResdataRes')
        showToast('Tạo dữ liệu thành công.!');
        this.props.navigation.goBack(null);
      }else{
        console.log('looix')
      }
    }catch (e) {
      console.log(e, 'eeee')
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
        console.log(photos, 'photosphotosphotos')
        this.setState((state) => ({
          images: [...state.images, ...convertImagesGallery(photos)],
          imagesUpload: [...state.imagesUpload, ...photos],
        }));
      })
      .catch((e) => null);
  }

  render() {
    let {images, videoUpload, audioUpload} = this.state;
    console.log(videoUpload,audioUpload, 'videoUploadvideoUpload')
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

    return (
      <SafeAreaView style={styleContainer.containerContent}>
        <ScrollView style={tw.p4}>

          <FormGroup
            id="datasetId"
            type={CONSTANTS.SELECT}
            value={[
              {
                display: CONSTANTS.NONE,
                children: this.state.dsDataset,
              },
            ]}
            single={true}
            subKey="children"
            required={false}
            displayKey="dataset_name"
            selectText="Bộ dữ liệu"
            selectedItems={[this.state.datasetId || ""]}
            showCancelButton={true}
            onCancel={(id, selected) => {
            }}
            editable={true}
            onConfirm={(id, selected) => {this.setState({datasetId: selected[0]._id})}}
          />

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

          <Gallery
            items={images}
            deleteImg={true}
            navigation={this.props.navigation}
            deleteImgFunc={this.deleteImgFunc}
          />
          <GradientButton
            text={I18n.t('Video')}
            style={[tw.mT1, styleContainer.buttonGradient]}
            onPress={() => this.pickVideo()}
          />
          {
            videoUpload.map((video, idx) => {
              return <View key={idx}>
                <Video
                  style={{width: 350, height: 300, marginTop: 10}}
                  source={{uri: video}}
                  useNativeControls
                  resizeMode="contain"
                  isLooping={true}
                />
              </View>
            })
          }
          <GradientButton
            text="Record"
            style={[tw.mT1, styleContainer.buttonGradient]}
            onPress={() => this.showRecordScreen()}
          />
          {
            audioUpload.map((audio, idx) => {
              return <AudioPlay1 key={idx} data={audio}/>
            })
          }

        </ScrollView>
        <ActionSheet
          ref={this.actionSheet}
          options={options}
          onPress={this.onActionPress}
          cancelButtonIndex={0}
          destructiveButtonIndex={4}
        />
      </SafeAreaView>
    )
  }
}

export default connect()(UploadScreen);