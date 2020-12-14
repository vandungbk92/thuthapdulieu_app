import React from 'react';


import { tw } from 'react-native-tailwindcss';

import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';

import I18n from '../../utilities/I18n';

import FormGroup from '../base/formGroup';

import { callPhone } from '../../helper/linkingHelper';
import { getAllContact } from '../../epics-reducers/services/ncovidServices';

import { CONSTANTS } from '../../constants';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

const LOAD_STATUS = {
  NONE: 0,
  IDLE: 1,
  FIRST_LOAD: 2,
  LOAD_MORE: 3,
  PULL_REFRESH: 4,
  ALL_LOADED: 5,
};

export default class MedicalContact extends React.Component {
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
          {I18n.t('Danh bạ khẩn cấp')}
        </RkText>
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      search: '',
      loadStatus: LOAD_STATUS.NONE,
    };

    this.page = 1;
    this.flatList = null;
  }

  componentDidMount() {
    this.onGetFirstLoad();
  }

  getPage() {
    return this.page;
  }

  setPage(page) {
    this.page = page;
  }

  onGetFirstLoad = async () => {
    this.setState({ loadStatus: LOAD_STATUS.FIRST_LOAD });

    this.setPage(1);

    const { docs } = await this.onGetRecords();

    this.setPage(this.getPage() + 1);

    this.setState({ docs: docs, loadStatus: LOAD_STATUS.IDLE });
  };

  onGetPullRefresh = async () => {
    this.setState({ loadStatus: LOAD_STATUS.PULL_REFRESH });

    this.setPage(1);

    const { docs } = await this.onGetRecords();

    this.setPage(this.getPage() + 1);

    this.setState({ docs: docs, loadStatus: LOAD_STATUS.IDLE });
  };

  onGetRecords = async () => {
    try {
      const responseData = await getAllContact();
      if (responseData && responseData.docs) {
        return responseData;
      }
      throw new Error(I18n.t('has_error'));
    } catch (error) {
      this.setState({ loadStatus: LOAD_STATUS.IDLE });
    }
  };

  renderItem = ({ item }) => (
    <TouchableOpacity style={tw.flexRow} onPress={() => callPhone(item.phone)}>
      <View
        style={[
          tw.w10,
          tw.h10,
          tw.mT1,
          tw.bgGray200,
          tw.roundedFull,
          tw.itemsCenter,
          tw.justifyCenter,
        ]}
      >
        <AntDesign
          name="customerservice"
          size={24}
          color={KittenTheme.colors.appColor}
        />
      </View>
      <View style={[tw.flex1, tw.mL2]}>
        <RkText rkType="bold">{item.name}</RkText>
        <RkText style={[tw.mTPx, tw.textSm, tw.textGray500]}>
          {item.phone}
        </RkText>
      </View>
    </TouchableOpacity>
  );

  renderFooter = () => {
    if (this.state.loadStatus === LOAD_STATUS.FIRST_LOAD) {
      return this.renderFirstLoad();
    } else if (this.state.loadStatus === LOAD_STATUS.LOAD_MORE) {
      return this.renderLoadMore();
    } else if (this.state.loadStatus === LOAD_STATUS.ALL_LOADED) {
      return this.renderAllLoaded();
    }
    return null;
  };

  renderSeparator = () => {
    return <View style={tw.h6} />;
  };

  renderEmpty = () => {
    if (this.state.loadStatus === LOAD_STATUS.IDLE) {
      return (
        <View style={[tw.itemsCenter, tw.justifyCenter]}>
          <RkText>{I18n.t('not_found')}</RkText>
        </View>
      );
    }
    return null;
  };

  renderFirstLoad = () => {
    return (
      <View style={[tw.itemsCenter, tw.justifyCenter]}>
        {/*<ActivityIndicator color={KittenTheme.colors.appColor} size="large" />*/}
        <RkText>{I18n.t('loading')}</RkText>
      </View>
    );
  };

  renderLoadMore = () => {
    return (
      <View style={[tw.flexRow, tw.pT2, tw.itemsCenter, tw.justifyCenter]}>
        {/*<ActivityIndicator color={KittenTheme.colors.warning} size="small" />*/}
        <RkText style={tw.mL1}>{I18n.t('load_more')}</RkText>
      </View>
    );
  };

  renderAllLoaded = () => {
    return (
      <View style={[tw.flexRow, tw.pT2, tw.itemsCenter, tw.justifyCenter]}>
        <RkText>{I18n.t('all_loaded')}</RkText>
      </View>
    );
  };

  render() {
    const regex = new RegExp(this.state.search, 'i');
    const filteredData = this.state.docs.filter(
      (doc) => doc && (regex.test(doc.name) || regex.test(doc.phone)),
    );

    return (
      <View style={styleContainer.containerContent}>
        <View style={tw.p4}>
          <FormGroup
            type={CONSTANTS.TEXT}
            editable={true}
            searchIcon={
              <MaterialIcons
                name="search"
                size={28}
                color={KittenTheme.colors.appColor}
              />
            }
            placeholderText={I18n.t('Tìm kiếm')}
            onChangeText={(id, value) => this.setState({ search: value })}
          />
        </View>
        <FlatList
          ref={(c) => (this.flatList = c)}
          data={filteredData}
          extraData={this.state}
          refreshing={this.state.loadStatus === LOAD_STATUS.PULL_REFRESH}
          keyExtractor={(item) => item._id}
          renderItem={this.renderItem}
          ListEmptyComponent={this.renderEmpty}
          ListFooterComponent={this.renderFooter}
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={this.onGetPullRefresh}
          contentContainerStyle={tw.p4}
        />
      </View>
    );
  }
}
