import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

import { RkText, RkTabSet, RkTab, RkTabPager } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';

import RecordInfo from './RecordInfo';
import RecordProcess from './RecordProcess';

import I18n from '../../utilities/I18n';

import { getHccDetail } from '../../epics-reducers/services/utility';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

export default class RecordDetail extends React.Component {
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
          {I18n.t('info_detail')}
        </RkText>
      )
    };
  };

  state = {
    details: [],
    isLoaded: false
  };

  async componentDidMount() {
    try {
      const { params } = this.props.navigation.state;
      const responseData = await getHccDetail(params._id);

      if (responseData) {
        this.setState({ details: responseData, isLoaded: true });
      } else {
        this.setState({ isLoaded: true });
      }
    } catch (error) {
      this.setState({ isLoaded: true });
    }
  }

  render() {
    const { params } = this.props.navigation.state;

    if (this.state.isLoaded) {
      return (
        <View style={styleContainer.containerContent}>
          <RkTabSet>
            <RkTab title={I18n.t('introduce')} isLazyLoad={false}>
              <ScrollView style={styles.tabContent}>
                <RecordInfo info={params} />
              </ScrollView>
            </RkTab>
            <RkTab title={I18n.t('record_process')} isLazyLoad={false}>
              <ScrollView style={styles.tabContent}>
                {this.state.details.map((item, index) =>
                  <RecordProcess key={String(index)} info={item} />
                )}
              </ScrollView>
            </RkTab>
          </RkTabSet>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: 10,
    paddingBottom: 0
  }
});
