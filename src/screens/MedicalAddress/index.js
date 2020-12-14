import React from 'react';

import moment from 'moment';

import {tw} from 'react-native-tailwindcss';

import {
  View,
  FlatList,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {RkText} from 'react-native-ui-kitten';
import {
  Ionicons,
  AntDesign,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import I18n from '../../utilities/I18n';

import FormGroup from '../base/formGroup';

import {getAllAddress, getAllCSYTByDanhMuc} from '../../epics-reducers/services/ncovidServices';

import {CONSTANTS} from '../../constants';

import {KittenTheme} from '../../../config/theme';
import {styleContainer} from '../../stylesContainer';
import {CHI_TIET_SU_KIEN_VAN_HOA, MEDICAL_ADDRESS_MAP} from "../../constants/router";

const LOAD_STATUS = {
  NONE: 0,
  IDLE: 1,
  FIRST_LOAD: 2,
  LOAD_MORE: 3,
  PULL_REFRESH: 4,
  ALL_LOADED: 5,
};

export default class MedicalAddress extends React.Component {
  static navigationOptions = ({navigation}) => {
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
          {I18n.t('Cơ sở y tế')}
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
    this.setState({loadStatus: LOAD_STATUS.FIRST_LOAD});

    this.setPage(1);

    const data = await this.onGetRecords();

    this.setPage(this.getPage() + 1);

    this.setState({docs: data, loadStatus: LOAD_STATUS.IDLE});
  };

  onGetPullRefresh = async () => {
    this.setState({loadStatus: LOAD_STATUS.PULL_REFRESH});

    this.setPage(1);

    const data = await this.onGetRecords();

    this.setPage(this.getPage() + 1);

    this.setState({docs: data, loadStatus: LOAD_STATUS.IDLE});
  };

  onGetRecords = async () => {
    try {
      let responseData = await getAllCSYTByDanhMuc();
      if (responseData) {
        let responseDataArr = responseData.map(data => {
          return {
            id: data._id,
            title: data.name,
            data: data.chi_tiet
          }
        })
        return responseDataArr;
      }
      throw new Error(I18n.t('has_error'));
    } catch (error) {
      this.setState({loadStatus: LOAD_STATUS.IDLE});
    }
  };

  renderItem = ({item}) => (
    <TouchableOpacity style={[tw.flexRow]} onPress={() => {
      this.props.navigation.navigate(MEDICAL_ADDRESS_MAP, {
        item: item,
        docs: this.state.docs
      })
    }}>
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
        <FontAwesome5
          name="hospital"
          size={24}
          color={KittenTheme.colors.appColor}
        />
      </View>
      <View style={[tw.flex1, tw.mL2]}>
        <RkText rkType="bold">{item.ten_co_so}</RkText>
        {
          !!item.dien_thoai && <RkText style={[tw.mTPx, tw.textSm, tw.textGray500]}>
            ĐT: {item.dien_thoai}
          </RkText>
        }

        {
          !!item.dia_chi && <RkText style={[tw.mTPx, tw.textSm, tw.textGray500]}>
            ĐC: {item.dia_chi}
          </RkText>
        }

        {/*

        */}
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
    return <View style={tw.h6}/>;
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
    let filteredData = []
    let {docs} = this.state
    for(let i=0; i<docs.length;i++){
      let isCheck = false
      let dmCSYT = Object.assign({}, docs[i])
      let dataFilter = dmCSYT.data ? dmCSYT.data : []

      const data = dataFilter.filter(
        (doc) => {
          let checkRegex = doc && (regex.test(doc.ten_co_so) || regex.test(doc.dien_thoai))
          if(checkRegex) isCheck = true
          return checkRegex
        }
      );

      if(isCheck){
        dmCSYT.data = data
        filteredData = [...filteredData, dmCSYT]
      }
    }

    return (
      <View style={styleContainer.containerContent}>
        <View style={[tw.flexRow, tw.p4, tw.itemsCenter]}>
          <TouchableOpacity style={[tw.pL1, tw.pR4]} onPress={() => {
            this.props.navigation.navigate(MEDICAL_ADDRESS_MAP, {
              item: null,
              docs: this.state.docs
            })
          }
          }>
            <MaterialCommunityIcons
              name="google-maps"
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
            onChangeText={(id, value) => this.setState({search: value})}
          />
        </View>
        <SectionList
          sections={filteredData}
          extraData={this.state}
          refreshing={this.state.loadStatus === LOAD_STATUS.PULL_REFRESH}
          keyExtractor={(item) => item._id}
          renderItem={this.renderItem}
          ListEmptyComponent={this.renderEmpty}
          ListFooterComponent={this.renderFooter}
          ItemSeparatorComponent={this.renderSeparator}
          onRefresh={this.onGetPullRefresh}
          contentContainerStyle={tw.p4}
          renderSectionHeader={({section: {title}}) => (
            <View style={[tw.bgWhite, tw.pY3]}>
              <RkText rkType="header4">{title}</RkText>
            </View>
          )}
        />
      </View>
    );
  }
}
