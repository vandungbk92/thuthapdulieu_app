import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { RkText } from 'react-native-ui-kitten';
import { styleContainer } from '../../stylesContainer';
import { tw } from 'react-native-tailwindcss';
import * as WebBrowser from 'expo-web-browser';
import {API, COMMON_APP} from "../../constants";

export default class TinTucDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    let { params } = navigation.state;
    let info_detail = params.info_detail;
    return {
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack(null)} style={{ paddingHorizontal: 20 }}>
          <Ionicons name="ios-arrow-back" size={20} color={'#00003c'}/>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>
          Chi tiết tin tức
        </RkText>
      ),
      // title: info_detail.title ? info_detail.title : 'Chi tiết thông báo'
    };
  };

  async downLoadFile(files) {
    let { info_detail } = this.props.navigation.state.params;
    let uri = COMMON_APP.HOST_API + API.FILES.format(files)
    await WebBrowser.openBrowserAsync(uri);
  }

  render() {
    let { info_detail } = this.props.navigation.state.params;
    let dataContent = '';
    if (info_detail) {
      dataContent = info_detail.content;
    }

    let html = `
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
        <!--<p><a href="#">(Bản tin đính kèm)</a></p>-->
        <p>${dataContent}</p>
      </body>
      </html>`;

    return (
      <View style={{ flex: 1 }}>
        <View style={[{ alignItems: 'center', marginTop: 10, color: '#00003c' }, tw.bgWhite, tw.pX2, tw.pY1]}>
          <RkText rkType="header5">
            {info_detail && info_detail.title ? info_detail.title : ''}
          </RkText>

        </View>

        <WebView originWhitelist={['*']}
                 source={{ html: html, baseUrl: '' }}
        />

        {
          info_detail.files && <TouchableOpacity onPress={() => this.downLoadFile(info_detail.files)} style={{alignItems: 'center'}}>
            <RkText rkType="header4" style={{alignItems: 'center', color: tw.textIndigo600}}>{'Bản tin đính kèm'}</RkText>
          </TouchableOpacity>
        }

      </View>
    );
  }
}
