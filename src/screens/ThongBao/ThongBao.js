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
import { Ionicons } from '@expo/vector-icons';

import I18n from '../../utilities/I18n';

import { getAll } from '../../epics-reducers/services/thongbaoService';

import { CHI_TIET_THONG_BAO_PAGE } from '../../constants/router';

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

export default class ThongBao extends React.Component {
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
          {I18n.t('Thông báo')}
        </RkText>
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
      const responseData = await getAll(this.getPage());
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
      style={[tw.flexRow]}
      onPress={() => {
        this.props.navigation.navigate(CHI_TIET_THONG_BAO_PAGE, { info_detail: item });
      }}
    >
      {/*<View style={[tw.w24, tw.h16, tw.bgGray200, tw.rounded]} />*/}
      <View style={[tw.flex1, tw.mL1]}>
        <RkText numberOfLines={4} rkType="bold">{item.title}</RkText>
        <View style={[tw.flexRow, tw.justifyBetween, tw.mL2]}>
          <RkText style={[tw.mT1, tw.textSm, tw.textGray500]}>
            {item.source}
          </RkText>
          <RkText style={[tw.mT1, tw.textSm, tw.textGray500]}>
            {moment(item.date_public).calendar(null, {
              sameDay: '[Hôm nay] [lúc] HH:mm',
              lastDay: '[Hôm qua] [lúc] HH:mm',
              lastWeek: 'L [lúc] HH:mm',
              sameElse: 'L [lúc] HH:mm',
            })}
          </RkText>

        </View>
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
