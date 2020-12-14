import React, {Component} from "react";
import {RkText} from "react-native-ui-kitten"
import {View, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet, Alert} from "react-native";

import {styles} from "./styles";
import {styleContainer} from "../../stylesContainer";
import {CONSTANTS} from "../../constants";
import {getById, getAll, add, delById, updateById} from "../../epics-reducers/services/hoidapServices";
import {
  convertFiles,
  convertImagesGallery, showToast
} from "../../epics-reducers/services/common";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {KittenTheme} from "../../../config/theme";
import {connect} from "react-redux"
import FormGroup from "../base/formGroup";
import {Gallery} from "../base/gallery";
import {Files} from "../base/files";
import I18n from '../../utilities/I18n';
import {timeFormatter} from '../../constants/dateFormat'
import AutoHeightWebView from 'react-native-autoheight-webview'
import {Button} from "react-native-elements";

class ChiTietHoiDap extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText}/>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>{I18n.t('Chi tiết câu hỏi')}</RkText>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = ({
      files: [],
      imagesReqGallery: []
    })
  }

  deleteHoiDap = async () => {

    Alert.alert(
      I18n.t("delete_data"),
      '',
      [
        {
          text: I18n.t("cancel"),
          style: 'cancel',
        },
        {
          text: 'OK', onPress: async () => {
            let {hoidap} = this.props.navigation.state.params
            let dataDel = await delById(hoidap._id)
            if(dataDel){
              showToast("Xóa câu hỏi thành công")
              this.props.navigation.state.params.onGoBack()
              this.props.navigation.goBack(null)
            }
          }
        },
      ],
      {cancelable: false},
    );


  }


  render() {
    let {hoidap} = this.props.navigation.state.params

    let files = convertFiles(hoidap.files)
    let imagesReqGallery = convertImagesGallery(hoidap.hinhanh)
    let txtTrangThai = ''
    if (hoidap.trangthai === -1) {
      txtTrangThai = 'Đang xử lý'
    } else if (hoidap.trangthai === 0) {
      txtTrangThai = 'Không trả lời'
    } else if (hoidap.trangthai === 1) {
      txtTrangThai = 'Đã trả lời'
    }

    let dataContent = ''
    let html = ''
    if (hoidap) {
      dataContent = hoidap.traloi
    }
    if (hoidap.trangthai === 1) {
      html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          body {
            font-family: Lohit-Gujarati;
            font-size: 1.25rem;
            color: black;
            padding: 0px 10px 10px 10px;
          }
        </style>
      </head>
      <body>
        <p>${dataContent}</p>
      </body>
      </html>`
    } else {

    }


    return (
      <SafeAreaView style={styles.screen}>
          <ScrollView style={styles.screen}>
            <View style={[styles.block]}>
              <RkText rkType="header4">{I18n.t("Chi tiêt câu hỏi")}</RkText>
              <View style={[styles.containerTitle]}>
                <FormGroup type={CONSTANTS.TEXT}
                           readOnly={true}
                           id="created_at"
                           backgroundColor="transparent"
                           placeholder={I18n.t("Ngày gửi")}
                           value={timeFormatter(hoidap.created_at)}
                           labelIcon={<MaterialCommunityIcons name="clock" size={20}
                                                              color={KittenTheme.colors.appColor}/>}
                />

                <FormGroup type={CONSTANTS.TEXT_AREA}
                           required={true}
                           readOnly={true}
                           editable={true}
                           id="content"
                           backgroundColor="transparent"
                           placeholder={I18n.t("content")}
                           value={hoidap.cauhoi}
                />


                <Files files={files}/>

                <Gallery navigation={this.props.navigation}
                         items={imagesReqGallery}
                />

              </View>
            </View>

            <View style={[styles.block]}>
              <RkText rkType="header4">{I18n.t("Nội dung trả lời")}</RkText>


              <View>
                <FormGroup type={CONSTANTS.TEXT}
                           readOnly={true}
                           id="trangthai"
                           backgroundColor="transparent"
                           placeholder={I18n.t("Trạng thái")}
                           value={txtTrangThai}
                />

              </View>
              {
                hoidap.trangthai === 1 && <View style={{flex: 1}}>
                  <AutoHeightWebView
                    // style={{ width: Dimensions.get('window').width - 15, marginTop: 35 }}
                    // customScript={`document.body.style.background = 'lightyellow';`}
                    customStyle={`
                      * {
                        font-family: 'Times New Roman';
                        text-align: 'center';
                      }
                      font-family: Lohit-Gujarati;
                      font-size: 1.25rem;
                      color: black;
                      padding: 0px 10px 10px 10px;
                    `}
                    // onSizeUpdated={(size => {console.log(size.height)})}
                    files={[{
                      href: 'cssfileaddress',
                      type: 'text/css',
                      rel: 'stylesheet'
                    }]}
                    source={{html: dataContent}}
                    scalesPageToFit={true}
                    viewportContent={'width=device-width, user-scalable=no'}
                  />
                </View>
              }

            </View>



          </ScrollView>

        {
          hoidap.trangthai !== 1 && <View style={styles.button}>
            <Button
              containerViewStyle={{width: 120}}
              borderRadius={16}
              icon={{
                name: "delete-forever",
                size: 15,
                color: "white"
              }}
              backgroundColor={'#e53935'}
              title={"Xóa câu hỏi"}
              onPress={this.deleteHoiDap}
            />
          </View>
        }
      </SafeAreaView>
    )
      ;
  }
}

function mapStateToProps(state) {
  const {userInfoRes, servicesRes, districtsRes, unitsRes} = state
  return {userInfoRes, servicesRes, districtsRes, unitsRes}
}

export default connect(mapStateToProps)(ChiTietHoiDap);

