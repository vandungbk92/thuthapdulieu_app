import React from 'react';
import moment from 'moment';

import { tw, color } from 'react-native-tailwindcss';
import { Ionicons } from '@expo/vector-icons';

import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { RkText } from 'react-native-ui-kitten';

import { withNavigation } from 'react-navigation';

import I18n from '../../utilities/I18n';

import { XACMINH_THONGTIN_DETAIL } from '../../constants/router';

import { KittenTheme } from '../../../config/theme';

import { getAll } from '../../epics-reducers/services/xacminhthongtinServices';

const LOAD_STATUS = {
  NONE: 0,
  IDLE: 1,
  FIRST_LOAD: 2,
  LOAD_MORE: 3,
  PULL_REFRESH: 4,
  ALL_LOADED: 5,
};

class ListTab extends React.Component {
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
        'noidung[like]': params?.tukhoa || '',
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
      onPress={() => {
        this.props.navigation.setParams({ forceRefresh: false });
        this.props.navigation.navigate(XACMINH_THONGTIN_DETAIL, item);
      }}
    >
      <RkText rkType="bold" numberOfLines={3}>
        {item.noidung}
      </RkText>
      <View style={[tw.flexRow, tw.mT1, tw.itemsCenter]}>
        <Ionicons name="md-code" size={18} color={color.gray600} />
        <RkText style={[tw.pL1, tw.textSm]}>{item.maxacminh}</RkText>
      </View>
      <View style={[tw.flexRow, tw.mT1]}>
        <Ionicons name="ios-link" size={18} color={color.gray600} />
        {item.lienket ? (
          <RkText
            rkType="bold"
            style={[tw.pL1, tw.pTPx, tw.textSm, tw.textBlue500]}
          >
            {item.lienket}
          </RkText>
        ) : (
          <RkText style={[tw.pL1, tw.pTPx]}>N/A</RkText>
        )}
      </View>
      <View style={[tw.flexRow, tw.mT1, tw.justifyBetween]}>
        <RkText style={[tw.textSm, tw.textGray500]}>
          {(item.tiepnhan === -1 && 'Chờ xác minh') ||
            (item.tiepnhan === 0 && 'Từ chối xác minh') ||
            (item.tiepnhan === 1 && 'Bổ sung thông tin') ||
            (item.tiepnhan === 2 && 'Đã xác minh')}
        </RkText>
        <RkText style={[tw.textSm, tw.textGray500]}>
          {moment(item.created_at).format('L LT')}
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
    );
  }
}

export default withNavigation(ListTab);
