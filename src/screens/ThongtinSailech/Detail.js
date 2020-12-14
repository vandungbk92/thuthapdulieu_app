import React from 'react';

import { tw } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, ScrollView, TouchableOpacity } from 'react-native';

import HTMLView from 'react-native-htmlview';

import I18n from '../../utilities/I18n';

import { Files } from '../base/files';
import { Gallery } from '../base/gallery';
import FormGroup from '../base/formGroup';

import { CONSTANTS } from '../../constants';
import { timeFormatter } from '../../constants/dateFormat';

import {
  convertFiles,
  convertImagesGallery,
} from '../../epics-reducers/services/common';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

export default class ThongtinSailechDetail extends React.Component {
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
          {I18n.t('Chi tiết thông tin sai lệch')}
        </RkText>
      ),
    };
  };

  render() {
    const { params } = this.props.navigation.state;

    const files = convertFiles(params.files);
    const images = convertImagesGallery(params.images);

    return (
      <ScrollView style={styleContainer.containerContent}>
        <View style={tw.p4}>
          <RkText rkType="header4">{params.tieude}</RkText>
          <View style={tw.mT2}>
            <FormGroup
              type={CONSTANTS.TEXT}
              value={timeFormatter(params.thoigian)}
              readOnly={true}
              placeholder="Thời gian"
            />
            <FormGroup
              type={CONSTANTS.TEXT_AREA}
              value={params.mota}
              readOnly={true}
              placeholder="Mô tả"
              containerStyle={tw.mT1}
            />
            <Files files={files} containerStyle={tw.mT1} />
            <Gallery
              items={images}
              navigation={this.props.navigation}
              containerStyle={tw.mT1}
            />
            <FormGroup
              type={CONSTANTS.BLOCK}
              readOnly={true}
              placeholder="Nội dung"
              containerStyle={tw.mT1}
            >
              <HTMLView value={params.noidung} />
            </FormGroup>
          </View>
        </View>
      </ScrollView>
    );
  }
}
