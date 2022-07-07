import React, { Component } from "react";
import { Text, View, TouchableOpacity, FlatList, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KittenTheme } from "./../../../config/theme";
import { RkText } from "react-native-ui-kitten";
import { styleContainer } from "./../../stylesContainer";
import { tw } from "react-native-tailwindcss";
import { getAll } from "./../../epics-reducers/services/quanlydulieuServices";
import moment from "moment";
import { CONSTANTS } from "./../../constants/constants";
import I18n from "./../../utilities/I18n";

import { Gallery } from "../base/gallery";
import { Video, Audio } from "expo-av";
import { COMMON_APP } from "../../constants";
import { DU_LIEU_DETAIL } from './../../constants/router';

const LOAD_STATUS = {
  NONE: 0,
  IDLE: 1,
  FIRST_LOAD: 2,
  LOAD_MORE: 3,
  PULL_REFRESH: 4,
  ALL_LOADED: 5,
};

export default class QuanlyDulieu extends Component {
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
          Quản lý dữ liệu
        </RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      docs: [],
      loadStatus: LOAD_STATUS.NONE,
      status: {},
    };
    this.page = 1;
    this.flatList = null;
  }

  getPage() {
    return this.page;
  }

  setPage(page) {
    this.page = page;
  }

  async componentDidMount() {
    this.onGetFirstLoad();
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

    const docs = await this.onGetRecords();

    this.setPage(this.getPage() + 1);
    this.setState((state) => ({
      docs: docs.length > 0 ? [...docs, ...state.docs] : state.docs,
      loadStatus: docs.length > 0 ? LOAD_STATUS.IDLE : LOAD_STATUS.ALL_LOADED,
    }));
  };

  onGetFirstLoad = async () => {
    this.setState({ loadStatus: LOAD_STATUS.FIRST_LOAD });
    this.setPage(1);

    const docs = await this.onGetRecords();

    this.setPage(this.getPage() + 1);
    this.setState({ docs: docs, loadStatus: LOAD_STATUS.IDLE });
  };

  onGetPullRefresh = async () => {
    this.setState({ loadStatus: LOAD_STATUS.PULL_REFRESH });
    this.setPage(1);

    const docs = await this.onGetRecords();

    this.setPage(this.getPage() + 1);
    this.setState({ docs: docs, loadStatus: LOAD_STATUS.IDLE });
  };

  onGetRecords = async () => {
    try {
      const responseData = await getAll(this.page, 10);
      if (responseData) {
        return responseData;
      }
      throw new Error(I18n.t("has_error"));
    } catch (error) {
      this.setState({ loadStatus: LOAD_STATUS.IDLE });
    }
  };

  renderItem = ({ item }) => {
    return (
      <View>
        <View style={[tw.flexRow, tw.justifyBetween]}>
          <RkText style={tw.w40} rkType="bold">
            Tên nhân viên:
          </RkText>
          <RkText style={[tw.flex1, tw.textRight]}>
            {item.nhanvien_id?.full_name}
          </RkText>
        </View>
        {item.created_at && (
          <View style={[tw.flexRow, tw.justifyBetween]}>
            <RkText style={tw.w40} rkType="bold">
              Ngày thu thập:
            </RkText>
            <RkText style={[tw.flex1, tw.textRight]}>
              {moment(item.ngayupload).format(CONSTANTS.DATE_FORMAT)}
            </RkText>
          </View>
        )}

        {item.hinhanh?.length > 0 && (
          <View>
            <RkText style={tw.w40} rkType="bold">
              Hình ảnh
            </RkText>
            <TouchableOpacity 
              style={[tw.bgGray800,tw.pX1, tw.pYPx, tw.selfStart,tw.rounded, tw.itemsCenter]}
              onPress={() => this.props.navigation.navigate(DU_LIEU_DETAIL, {data: item})}
            >
              <RkText style={tw.textWhite}>Chi tiết</RkText>
            </TouchableOpacity>
          </View>
        )}
        {item.video && (
          <View>
            <RkText style={[tw.w40]} rkType="bold">
              Video:
            </RkText>
            <TouchableOpacity 
              style={[tw.bgGray800,tw.pX1, tw.pYPx, tw.selfStart,tw.rounded, tw.itemsCenter]}
              onPress={() => this.props.navigation.navigate(DU_LIEU_DETAIL, {data: item})}
            >
              <RkText style={tw.textWhite}>Chi tiết</RkText>
            </TouchableOpacity>
          </View>
        )}
        {item.audio && (
          <View>
            <RkText style={tw.w40} rkType="bold">
              Audio:
            </RkText>
            <TouchableOpacity 
              style={[tw.bgGray800,tw.pX1, tw.pYPx, tw.selfStart,tw.rounded, tw.itemsCenter]}
              onPress={() => this.props.navigation.navigate(DU_LIEU_DETAIL, {data: item})}
            >
              <RkText style={tw.textWhite}>Chi tiết</RkText>
            </TouchableOpacity>
          </View>
        )}
        {item.ghichu > 0 && (
          <View>
            <RkText style={tw.w40} rkType="bold">
              Ghi chú:
            </RkText>
            <RkText>{item.ghichu}</RkText>
          </View>
        )}
      </View>
    );
  };

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
          <RkText>{I18n.t("not_found")}</RkText>
        </View>
      );
    }
    return null;
  };

  renderFirstLoad = () => {
    return (
      <View style={[tw.itemsCenter, tw.justifyCenter]}>
        <RkText>{I18n.t("loading")}</RkText>
      </View>
    );
  };

  renderLoadMore = () => {
    return (
      <View style={[tw.flexRow, tw.pT2, tw.itemsCenter, tw.justifyCenter]}>
        <RkText style={tw.mL1}>{I18n.t("load_more")}</RkText>
      </View>
    );
  };

  renderAllLoaded = () => {
    return (
      <View style={[tw.flexRow, tw.pT2, tw.itemsCenter, tw.justifyCenter]}>
        <RkText>{I18n.t("all_loaded")}</RkText>
      </View>
    );
  };

  render() {
    return (
      <View style={tw.p4}>
        <FlatList
          data={this.state.docs}
          renderItem={this.renderItem}
          keyExtractor={(_, index) => index}
          onEndReachedThreshold={0.5}
          refreshing={this.state.loadStatus === LOAD_STATUS.PULL_REFRESH}
          ListEmptyComponent={this.renderEmpty}
          ListFooterComponent={this.renderFooter}
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={this.onGetPullRefresh}
          onEndReached={this.onLoadMore}
        />
      </View>
    );
  }
}
