import React from 'react';

import { tw, color } from 'react-native-tailwindcss';

import { View, TouchableOpacity } from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';

import { WebView } from 'react-native-webview';

import I18n from '../../utilities/I18n';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';
import {PLATFORM_IOS} from '../../constants/variable';
import * as WebBrowser from 'expo-web-browser';
import {showToast} from "../../epics-reducers/services/common";

export default class ChiTietVanBan extends React.Component {
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
          Chi Tiết văn bản
        </RkText>
      ),
    };
  };

  async downLoadFile(file) {
    let {data} = this.props.navigation.state.params
    data = JSON.parse(data)

    // goij api tair file kia veef -url
    let url = 'https://docs.google.com/viewer?url=https://phanhoi.thanhhoa.gov.vn/api/get-files/c182.signed_1582276932110.pdf'
    let dataBrowser = await WebBrowser.openBrowserAsync(url);
  }

  render() {

    return (
      <View style={styleContainer.containerContent}>
        <TouchableOpacity onPress={this.downLoadFile()}>
          <RkText rkType="link">{''}</RkText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} style={[tw.textCenter]}>
          <RkText rkType="link" style={[tw.textCenter, tw.textLg]}>{'Trở lại'}</RkText>
        </TouchableOpacity>
      </View>

    );
  }
}
