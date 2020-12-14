import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { View, TouchableOpacity } from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';

import { WebView } from 'react-native-webview';

import I18n from '../../utilities/I18n';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

export default class MedicalNewsDetail extends React.Component {
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
          {I18n.t('Tin tức y tế')}
        </RkText>
      ),
    };
  };

  render() {
    const news = this.props.navigation.getParam('news', {});

    return (
      <View style={styleContainer.containerContent}>
        <WebView source={{ uri: news.url }} originWhitelist={['*']} />
      </View>
    );
  }
}
