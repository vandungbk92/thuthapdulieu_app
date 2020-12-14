import React from 'react';

import { tw } from 'react-native-tailwindcss';

import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import I18n from '../../utilities/I18n';

import FormGroup from '../base/formGroup';

import { getAll } from '../../epics-reducers/services/sukienService';

import { CONSTANTS } from '../../constants';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';
import {dateFormatter} from '../../helper/dateFormat';
import {CHI_TIET_SU_KIEN_VAN_HOA} from "../../constants/router";

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
          {I18n.t('Lịch ngày lễ, sự kiện')}
        </RkText>
      ),
    };
  };

  constructor(props) {
    super(props);

    var d = new Date();
    var n = d.getFullYear();
    let minDate = n + '-01-01';
    let maxDate = n + '-12-31'

    this.state = {
      docs: [],
      minDate,
      maxDate,
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
      var d = new Date();
      var n = d.getFullYear();
      const responseData = await getAll(1, 0, '&nam_nghi=' + n);
      if (responseData && responseData.docs) {
        return responseData;
      }
      throw new Error(I18n.t('has_error'));
    } catch (error) {
      this.setState({ loadStatus: LOAD_STATUS.IDLE });
    }
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={[tw.flexRow]} onPress={() => {
        this.props.navigation.navigate(CHI_TIET_SU_KIEN_VAN_HOA, {
          item: item,
          minDate: this.state.minDate,
          maxDate: this.state.maxDate,
          docs: this.state.docs
        })}
      }>
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
          <RkText rkType="bold">{item.ten_ngay_nghi}</RkText>
          <RkText style={[tw.mTPx, tw.textSm, tw.textGray500]}>
            {dateFormatter(item.ngay_nghi)}
          </RkText>
        </View>
      </TouchableOpacity>
    )
  }

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
        <View style={[tw.flexRow, tw.p4, tw.itemsCenter]}>
          <TouchableOpacity style={[tw.pL1, tw.pR4]} onPress={() => {
            this.props.navigation.navigate(CHI_TIET_SU_KIEN_VAN_HOA, {
              item: null,
              minDate: this.state.minDate,
              maxDate: this.state.maxDate,
              docs: this.state.docs
            })}
          }>
            <MaterialCommunityIcons
              name="calendar"
              size={28}
              color={KittenTheme.colors.appColor}
            />
          </TouchableOpacity>
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
            containerStyle={tw.flex1}
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
