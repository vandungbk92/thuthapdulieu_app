import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { View, FlatList, TouchableOpacity } from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import I18n from '../../utilities/I18n';

import * as ROUTER from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import { dateFormatter } from '../../helper/dateFormat';
import { getThongtinDichte } from '../../epics-reducers/services/ncovidServices';

import DichteCardInfo from './CardInfo';

const LOAD_STATUS = {
  NONE: 0,
  IDLE: 1,
  FIRST_LOAD: 2,
  LOAD_MORE: 3,
  PULL_REFRESH: 4,
  ALL_LOADED: 5,
};

export default class ThongtinDichte extends React.Component {
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
          {I18n.t('Thông tin dịch tễ')}
        </RkText>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => navigation.navigate(ROUTER.THONGTIN_DICHTE_FILTER)}
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

      benhnhanso: props.navigation.getParam('benhnhanso'), // Bệnh nhân số
      ngay: props.navigation.getParam('ngay'), // Ngày

      province_id: props.navigation.getParam('province_id'), // Tỉnh
      province_name: props.navigation.getParam('province_name'),

      district_id: props.navigation.getParam('district_id'), // Huyện
      district_name: props.navigation.getParam('district_name'),

      ward_id: props.navigation.getParam('ward_id'), // Xã
      ward_name: props.navigation.getParam('ward_name'),

      tukhoa: props.navigation.getParam('tukhoa'), // Từ khóa
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
      dataDocs: docs.length > 0 ? [...docs, ...state.dataDocs] : state.dataDocs,
      loadStatus: docs.length > 0 ? LOAD_STATUS.IDLE : LOAD_STATUS.ALL_LOADED,
    }));
  };

  onGetFirstLoad = async () => {
    this.setState({ loadStatus: LOAD_STATUS.FIRST_LOAD });
    this.setPage(1);

    const { docs } = await this.onGetRecords();

    this.setPage(this.getPage() + 1);
    this.setState({ dataDocs: docs, loadStatus: LOAD_STATUS.IDLE });
  };

  onGetPullRefresh = async () => {
    this.setPage(1);

    const { docs } = await this.onGetRecords();

    this.setPage(this.getPage() + 1);
    this.setState({ dataDocs: docs, loadStatus: LOAD_STATUS.IDLE });
  };

  onGetRecords = async () => {
    try {
      const {
        benhnhanso,
        ngay,
        province_id,
        district_id,
        ward_id,
        tukhoa,
      } = this.state;
      const page = this.getPage();
      const params = {
        benhnhanso,
        ngay,
        huyen_id: district_id,
        xa_id: ward_id,
        tukhoa,
      };
      const responseData = await getThongtinDichte(page, params);
      if (responseData && responseData.docs) {
        return responseData;
      }
      throw new Error(I18n.t('has_error'));
    } catch (error) {
      this.setState({ loadStatus: LOAD_STATUS.IDLE });
    }
  };

  renderItem = ({ item }) => <DichteCardInfo {...item} />;

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
    return <View style={[tw.h4, tw.bgGray300]} />;
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
      <View style={[tw.pY4, tw.itemsCenter, tw.justifyCenter]}>
        <RkText>{I18n.t('loading')}</RkText>
      </View>
    );
  };

  renderLoadMore = () => {
    return (
      <View style={[tw.flexRow, tw.pY2, tw.itemsCenter, tw.justifyCenter]}>
        <RkText style={tw.mL1}>{I18n.t('load_more')}</RkText>
      </View>
    );
  };

  renderAllLoaded = () => {
    return (
      <View style={[tw.flexRow, tw.pY2, tw.itemsCenter, tw.justifyCenter]}>
        <RkText>{I18n.t('all_loaded')}</RkText>
      </View>
    );
  };

  renderSearchText = () => {
    const { benhnhanso, ngay, district_name, ward_name, tukhoa } = this.state;

    if (benhnhanso || ngay || district_name || ward_name || tukhoa) {
      let searchText = 'Tìm kiếm';
      if (benhnhanso) {
        searchText += ` bệnh nhân ${benhnhanso}`;
      }
      if (ngay) {
        searchText += ` ngày ${dateFormatter(ngay)}`;
      }
      if (district_name || ward_name) {
        searchText += ` tại ${[district_name, ward_name]
          .filter(Boolean)
          .join(', ')}`;
      }
      if (tukhoa) {
        searchText += ` với từ khóa `;
      }

      return (
        <RkText style={[tw.p4, tw.bgGray200]} rkType="bold">
          {searchText}
          {tukhoa && <RkText style={tw.italic}>{`"${tukhoa}"`}</RkText>}
        </RkText>
      );
    }
    return null;
  };

  render() {
    return (
      <View style={styleContainer.containerContent}>
        {this.renderSearchText()}
        <FlatList
          ref={(c) => (this.flatList = c)}
          data={this.state.dataDocs}
          extraData={this.state.loadStatus}
          refreshing={this.state.loadStatus === LOAD_STATUS.PULL_REFRESH}
          keyExtractor={(item) => item._id}
          renderItem={this.renderItem}
          ListEmptyComponent={this.renderEmpty}
          ListFooterComponent={this.renderFooter}
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={this.onGetPullRefresh}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={0.1}
        />
      </View>
    );
  }
}
