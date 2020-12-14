import React from 'react';
import moment from 'moment';

import { tw } from 'react-native-tailwindcss';

import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import I18n from '../../utilities/I18n';

import {
  THONGTIN_SAILECH_DETAIL,
  THONGTIN_SAILECH_FILTER,
} from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { getAll } from '../../epics-reducers/services/thongtinsailechServices';

const LOAD_STATUS = {
  NONE: 0,
  IDLE: 1,
  FIRST_LOAD: 2,
  LOAD_MORE: 3,
  PULL_REFRESH: 4,
  ALL_LOADED: 5,
};

export default class ThongtinSailech extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

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
          {I18n.t('Thông tin sai lệch')}
        </RkText>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => navigation.navigate(THONGTIN_SAILECH_FILTER, params)}
        >
          <MaterialCommunityIcons
            name="filter-outline"
            size={20}
            color={KittenTheme.colors.primaryText}
          />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      loadStatus: LOAD_STATUS.NONE,
    };

    this.page = 1;
    this.flatList = null;
  }

  componentDidMount() {
    this.onGetFirstLoad();
    this.navigationListener = this.props.navigation.addListener('didFocus', (payload) => {
      const { params } = payload.state;
      if (params?.forceRefresh) {
        this.onGetFirstLoad();
      }
    });
  }

  componentWillUnmount() {
    this.navigationListener?.remove();
  }

  getPage() {
    return this.page;
  }

  setPage(page) {
    this.page = page;
  }

  onLoadMore = () => {
    if (this.state.loadStatus === LOAD_STATUS.IDLE) {
      if (this.flatList && this.flatList._listRef._scrollMetrics.offset > 1) {
        this.onGetLoadMore();
      }
    }
  };

  onGetLoadMore = async () => {
    this.setState({ loadStatus: LOAD_STATUS.LOAD_MORE });

    const { docs } = await this.onGetRecords();

    this.setPage(this.getPage() + 1);
    this.setState((state) => ({
      docs: docs.length > 0 ? [...docs, ...state.docs] : state.docs,
      loadStatus: docs.length > 0 ? LOAD_STATUS.IDLE : LOAD_STATUS.ALL_LOADED,
    }));
  };

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
      const { params } = this.props.navigation.state;
      const requestParams = {
        'tieude[like]': params?.tukhoa || '',
        'thoigian[from]': params?.fromDate || '',
        'thoigian[to]': params?.toDate || '',
      };
      const responseData = await getAll(this.page, 10, requestParams);
      if (responseData && responseData.docs) {
        return responseData;
      }
      throw new Error(I18n.t('has_error'));
    } catch (error) {
      this.setState({ loadStatus: LOAD_STATUS.IDLE });
    }
  };

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.navigate(THONGTIN_SAILECH_DETAIL, item);
      }}
    >
      <RkText rkType="bold" numberOfLines={2}>
        {item.tieude}
      </RkText>
      <RkText style={[tw.mT1, tw.textSm]} numberOfLines={3}>
        {item.mota}
      </RkText>
      <RkText style={[tw.mT1, tw.textSm, tw.textRight, tw.textGray500]}>
        {moment(item.thoigian).format('L LT')}
      </RkText>
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
    return <View style={[tw.mY2, tw.hPx, tw.bgGray400]} />;
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
        <RkText>{I18n.t('loading')}</RkText>
      </View>
    );
  };

  renderLoadMore = () => {
    return (
      <View style={[tw.flexRow, tw.pT2, tw.itemsCenter, tw.justifyCenter]}>
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
    return (
      <View style={styleContainer.containerContent}>
        <FlatList
          ref={(c) => (this.flatList = c)}
          data={this.state.docs}
          extraData={this.state}
          refreshing={this.state.loadStatus === LOAD_STATUS.PULL_REFRESH}
          keyExtractor={(item) => item._id}
          renderItem={this.renderItem}
          ListEmptyComponent={this.renderEmpty}
          ListFooterComponent={this.renderFooter}
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={this.onGetPullRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={0.1}
          contentContainerStyle={tw.p4}
        />
      </View>
    );
  }
}
