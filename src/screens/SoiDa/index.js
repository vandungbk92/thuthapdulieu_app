import React from 'react';

import { tw } from 'react-native-tailwindcss';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { RkText } from 'react-native-ui-kitten';
import { View, FlatList, TouchableOpacity } from 'react-native';

import I18n from '../../utilities/I18n';

import {
  SOI_DA_FILTER,
  SOI_DA_DETAIL,
  SOI_DA_CREATE,
} from '../../constants/router';
import { timeFormatter } from '../../constants/dateFormat';

import { getAll } from '../../epics-reducers/services/soidaServices';

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

export default class SoiDa extends React.Component {
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
          {I18n.t('Soi da')}
        </RkText>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => navigation.navigate(SOI_DA_FILTER, params)}
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
    this.didFocusListener = this.props.navigation.addListener(
      'didFocus',
      this.navigationDidFocus,
    );
    this.didBlurListener = this.props.navigation.addListener(
      'didBlur',
      this.navigationDidBlur,
    );
  }

  componentWillUnmount() {
    this.didFocusListener?.remove();
    this.didBlurListener?.remove();
  }

  navigationDidFocus = (payload) => {
    const { params } = payload.state;
    if (params?.forceRefresh) {
      this.onGetFirstLoad();
    }
  };

  navigationDidBlur = () => {
    this.props.navigation.setParams({ forceRefresh: false });
  };

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
        'makham[like]': params?.makham || '',
        'created_at[from]': params?.fromDate || '',
        'created_at[to]': params?.toDate || '',
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
      onPress={() => this.props.navigation.navigate(SOI_DA_DETAIL, item)}
    >
      <View style={[tw.flexRow, tw.justifyBetween]}>
        <RkText rkType="bold">Mã khám</RkText>
        <RkText>{item.makham}</RkText>
      </View>
      <View style={[tw.flexRow, tw.mT1, tw.justifyBetween]}>
        <RkText rkType="bold">Tuổi</RkText>
        <RkText>{item.tuoi}</RkText>
      </View>
      <View style={[tw.flexRow, tw.mT1, tw.justifyBetween]}>
        <RkText rkType="bold">Triệu chứng</RkText>
        <RkText>
          {item.trieuchung_id.map(({ trieuchung }) => trieuchung).join(', ')}
        </RkText>
      </View>
      <View style={[tw.flexRow, tw.mT1, tw.justifyBetween]}>
        <RkText rkType="bold">Thời gian</RkText>
        <RkText>{timeFormatter(item.created_at)}</RkText>
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
          contentContainerStyle={[tw.p4, tw.pB20]}
        />
        <View style={[tw.absolute, tw.p4, tw.bottom0, tw.right0]}>
          <TouchableOpacity
            style={[
              tw.flexRow,
              tw.p3,
              tw.w40,
              tw.roundedFull,
              tw.itemsCenter,
              tw.justifyCenter,
              { backgroundColor: KittenTheme.colors.appColor },
            ]}
            onPress={() => this.props.navigation.navigate(SOI_DA_CREATE)}
          >
            <Ionicons
              name="ios-add"
              size={26}
              color={KittenTheme.colors.white}
            />
            <View style={tw.w2} />
            <RkText rkType="bold" style={tw.textWhite}>
              Thu thập dữ liệu
            </RkText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
