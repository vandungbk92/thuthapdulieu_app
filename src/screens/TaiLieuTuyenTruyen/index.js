import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { View, TouchableOpacity, ActivityIndicator } from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

import I18n from '../../utilities/I18n';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

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
          {I18n.t('Tài liệu tuyên truyền')}
        </RkText>
      ),
    };
  };

  render() {
    return (
      <View style={styleContainer.containerContent}>
        <WebView
          source={{
            uri: 'http://covid19.thanhhoa.gov.vn/tai-lieu-tuyen-truyen.aspx',
          }}
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
        />
      </View>
    );
  }
}
