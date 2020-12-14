import React from 'react';

import { tw, color } from 'react-native-tailwindcss';

import { View, FlatList, TouchableOpacity } from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';

import I18n from '../../utilities/I18n';

import Widget from './components/Widget';

import { getAllFaqs } from '../../epics-reducers/services/ncovidServices';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

export default class MedicalQuestion extends React.Component {
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
          {I18n.t('Hỏi đáp')}
        </RkText>
      ),
    };
  };

  state = {
    data: [],
    loading: false,
  };

  async componentDidMount() {
    await this.fetchData();
  }

  async fetchData() {
    const responseData = await getAllFaqs();
    if (responseData && responseData.docs) {
      this.setState({ data: responseData.docs, loading: true });
    }
  }

  renderItem = ({ item, index }) => (
    <Widget
      question={item.question}
      answer={item.answer}
      expanded={index === 0}
    />
  );

  renderEmpty = () => {
    if (this.state.loading) {
      return (
        <View style={[tw.itemsCenter, tw.justifyCenter]}>
          <RkText>{I18n.t('not_found')}</RkText>
        </View>
      );
    }
    return null;
  };

  renderSeparator = () => {
    return <View style={[tw.mY4, tw.hPx, tw.bgGray300]} />;
  };

  render() {
    return (
      <View style={styleContainer.containerContent}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={this.renderEmpty}
          ItemSeparatorComponent={this.renderSeparator}
          contentContainerStyle={tw.p4}
        />
      </View>
    );
  }
}
