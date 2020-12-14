import React from 'react';

import { tw, color } from 'react-native-tailwindcss';

import { View, TouchableOpacity, ActivityIndicator } from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { WebView } from 'react-native-webview';

import I18n from '../../utilities/I18n';
import * as WebBrowser from 'expo-web-browser';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';
import {PLATFORM_IOS} from '../../constants/variable'
import {CHI_TIET_VAN_BAN_PAGE} from '../../constants/router';
import {getFileNameVanBan} from '../../epics-reducers/services/medicalSevices'
import {API, COMMON_APP} from "../../constants";

export default class MedicalDocument extends React.Component {
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
          {I18n.t('Văn bản chỉ đạo')}
        </RkText>
      ),
    };
  };

  onWebMessage = async (event) => {
    // gọi api lấy lên files.
    let data = event.nativeEvent.data
    data = JSON.parse(data)
    let id = data['ctl00$ContentPlaceHolderContent$IDVanBanPhapQuyHiddenField']
    let dataRes = await getFileNameVanBan(id, data);
    if(dataRes && dataRes.file_name){
      let url = `${COMMON_APP.HOST_API}${API.VAN_BAN.format(dataRes.file_name)}`
      let urlDoc = 'https://docs.google.com/viewer?url=' + url
      let dataBrowser = await WebBrowser.openBrowserAsync(url);
    }
  };

  render() {
    return (
      <View style={styleContainer.containerContent}>
        {
          PLATFORM_IOS ?
            <WebView
              source={{
                uri:
                  'http://covid19.thanhhoa.gov.vn/van-ban-chi-dao.aspx?IdNhom=4&IdCoQuan=2',
              }}
              onMessage={this.onWebMessage}
              renderLoading={() => (
                <View style={[tw.absolute, tw.top0, tw.insetX0]}>
                  <ActivityIndicator
                    size="large"
                    color={KittenTheme.colors.appColor}
                    style={[tw.mT4, tw.p2, tw.rounded, tw.bgWhite, tw.selfCenter]}
                  />
                </View>
              )}
              originWhitelist={['*']}
              javaScriptEnabled={true}
              startInLoadingState={true}
            /> :
            <WebView
              source={{
                uri:
                  'http://covid19.thanhhoa.gov.vn/van-ban-chi-dao.aspx?IdNhom=4&IdCoQuan=2',
              }}
              onMessage={this.onWebMessage}
              renderLoading={() => (
                <View style={[tw.absolute, tw.top0, tw.insetX0]}>
                  <ActivityIndicator
                    size="large"
                    color={KittenTheme.colors.appColor}
                    style={[tw.mT4, tw.p2, tw.rounded, tw.bgWhite, tw.selfCenter]}
                  />
                </View>
              )}
              originWhitelist={['*']}
              javaScriptEnabled={true}
              injectedJavaScript={`
            function postMessage() {
              var data = {
                __EVENTTARGET: 'ctl00$ContentPlaceHolderContent$FormView1$LinkButton1',
                __EVENTARGUMENT: '',

                __VIEWSTATE: document.querySelector('input[name="__VIEWSTATE"]') ? document.querySelector('input[name="__VIEWSTATE"]').value : '',
                __VIEWSTATEGENERATOR: document.querySelector('input[name="__VIEWSTATEGENERATOR"]') ? document.querySelector('input[name="__VIEWSTATEGENERATOR"]').value : '',
                __EVENTVALIDATION: document.querySelector('input[name="__EVENTVALIDATION"]') ? document.querySelector('input[name="__EVENTVALIDATION"]').value : '',

                ctl00$ContentPlaceHolderContent$IDVanBanPhapQuyHiddenField: document.querySelector('input[name="ctl00$ContentPlaceHolderContent$IDVanBanPhapQuyHiddenField"]') ? document.querySelector('input[name="ctl00$ContentPlaceHolderContent$IDVanBanPhapQuyHiddenField"]').value : '',
              };
              window.ReactNativeWebView.postMessage(JSON.stringify(data));
            }

            (function main() {
              var downloadButton = document.getElementById('ContentPlaceHolderContent_FormView1_LinkButton1');
              if (downloadButton) {
                downloadButton.addEventListener('click', function(event) {
                  event.preventDefault();
                  postMessage();
                  return false;
                });
              }
            })();

            true;
          `}
            startInLoadingState={true}
          />
        }
      </View>
    );
  }
}
