import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, StyleSheet } from "react-native";
import { styleContainer } from "../../stylesContainer";
import { RkText } from "react-native-ui-kitten"
import { getMyRequests } from "../../epics-reducers/services/requestServices";
import { CONSTANTS, API, COMMON_APP } from "../../constants";
import axios from "axios"
import moment from "moment"
import { Ionicons } from "@expo/vector-icons";
import { KittenTheme } from "../../../config/theme";
import { connect } from "react-redux"
import CardCustom from "../base/card";
import { SEARCH_PAGE, REQUEST_DETAIL_PAGE } from "../../constants/router";
import I18n from '../../utilities/I18n';

class MyRequests extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>{I18n.t("my_self")}</RkText>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styleContainer.headerButton}
            onPress={() => navigation.navigate(SEARCH_PAGE, { type: CONSTANTS.MY_REQUESTS, onGoBack: navigation.state.params.onPressSearch })}>
            <Ionicons name="ios-search" size={20} color={KittenTheme.colors.appColor} />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.onPressSearch = this.onPressSearch.bind(this)
    this.onReloadData = this.onReloadData.bind(this)
    this.state = {
      data: [],
      page: 1,
      pages: 1,
      total: 0,
      serviceSelected: null,
      districtSelected: null,
      statusSelected: -2,
      searchTitle: '',

      isDateTimePickerVisible: false,
      startDate: "",
      endDate: "",
      startDateReal: "",
      endDateReal: "",
      isStartDate: false,
      isEndDate: false
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      onPressSearch: this.onPressSearch,
      notification: this.state.notification
    })
  }

  async componentDidMount() {
    try {
      let pageActive = this.state.page
      let {userInfoRes} = this.props
      let apiRequest = [getMyRequests(pageActive, null, null, userInfoRes.phone)]
      let requests
      let apiResponse = await axios.all(apiRequest).then(axios.spread(function (requests) {
        return { requests: requests }
      }));

      requests = apiResponse.requests

      this.setState({
        data: requests.docs,
        pages: requests.pages,
        page: requests.page,
        total: requests.total
      })
    } catch (error) {
      // showToast(I18n.t("show_error"))
    }
  }

  async onEndReached() {
    let pageActive = this.state.page
    let serviceActive = this.state.serviceSelected
    let districtActive = this.state.districtSelected
    let statusActive = this.state.statusSelected
    let startDate = this.state.startDateReal
    let endDate = this.state.endDateReal
    let searchTitle = this.state.searchTitle
    let statusQuery = (statusActive === -2 || !statusActive) ? "" : (statusActive === 2 ? "&isPublic=1" : "&isPublic=0&confirmed={0}".format(statusActive))
    let titleQuery = searchTitle ? `${'&title[like]='}${searchTitle}` : ''

    let queryStr = `${serviceActive ? "&service_id={0}".format(serviceActive) : ""}${statusQuery}${districtActive ? "&district_id={0}".format(districtActive) : ""}${startDate ? "&created_at[from]={0}".format(startDate) : ""}${endDate ? "&created_at[to]={0}".format(endDate) : ""}${titleQuery}`

    let {userInfoRes} = this.props
    let requests = await getMyRequests(pageActive + 1, 10, queryStr, userInfoRes.phone);
    if (requests) {
      const data = this.state.data.concat(requests.docs);
      this.setState({
        data: data,
        pages: requests.pages,
        page: requests.page,
        total: requests.total
      });
    } else {
      // showToast(I18n.t("show_error"))
    }
  }

  async onPressSearch(serviceSelected, districtSelected, statusSelected, startDateReal, endDateReal, searchTitle) {
    let pageActive = 1
    let serviceActive = serviceSelected
    let districtActive = districtSelected
    let statusActive = statusSelected
    let startDate = startDateReal
    let endDate = endDateReal

    let statusQuery = (statusActive === -2 || !statusActive) ? "" : (statusActive === 2 ? "&isPublic=1" : "&isPublic=0&confirmed={0}".format(statusActive))
    let titleQuery = searchTitle ? `${'&title[like]='}${searchTitle}` : ''
    let queryStr = `${serviceActive ? "&service_id={0}".format(serviceActive) : ""}${statusQuery}${districtActive ? "&district_id={0}".format(districtActive) : ""}${startDate ? "&created_at[from]={0}".format(startDate) : ""}${endDate ? "&created_at[to]={0}".format(endDate) : ""}${titleQuery}`

    let {userInfoRes} = this.props
    let requests = await getMyRequests(pageActive, 10, queryStr, userInfoRes.phone);

    if (requests) {
      this.setState({
        refreshing: false,
        serviceSelected,
        districtSelected,
        statusSelected,
        startDateReal,
        endDateReal,
        searchTitle,
        data: requests.docs,
        page: requests.page,
        total: requests.total,
      })
    } else {
      // showToast(I18n.t("show_error"))
    }
  }

  onRefresh() {
    let { serviceSelected, districtSelected, statusSelected, startDateReal, endDateReal, searchTitle } = this.state
    this.onPressSearch(serviceSelected, districtSelected, statusSelected, startDateReal, endDateReal, searchTitle)
  }

  onPress(id) {
    this.props.navigation.navigate(REQUEST_DETAIL_PAGE, {
      id: id,
      type: CONSTANTS.MY_REQUESTS,
      onGoBack: this.onReloadData
    })
  }

  onReloadData(requestRes){
    let {data} = this.state
    data = data.map(dta => {
      if(dta._id === requestRes._id){
        return requestRes
      }
      return dta
    })

    this.setState({data})
  }

  render() {
    let checkData = !!this.state.data.length
    return (
      <View style={styleContainer.containerContent}>
        <RkText style={{textAlign: 'center'}} rkType='header6'>{this.state.total + ' ' + I18n.t("feedback_found")}</RkText>
        {checkData ?
          <FlatList
            style={styles.listViewContainer}
            data={this.state.data}
            renderItem={({ item: rowData, index: rowID }) => {
              let indexRow = parseInt(rowID) + 1
              let img = rowData.images_req[0] ? { uri: COMMON_APP.HOST_API_PHAN_HOI + API.IMAGES.format(rowData.images_req[0]) } : CONSTANTS.IMAGE_DEFAULT_LARGE
              return <CardCustom
                source={img}
                title={rowData.title}
                content={rowData.content}
                indexRow={indexRow.toString()}
                time={moment(rowData.created_at).format(CONSTANTS.DATE_FORMAT)}
                confirmed={rowData.confirmed}
                isPublic={rowData.isPublic}
                onPress={() => this.onPress(rowData._id)} />
            }}
            keyExtractor={(item, index) => String(index)}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            onEndReached={this.onEndReached.bind(this)}
            renderFooter={() => {
              return (
                (this.state.page <= this.state.pages) &&
                this.state.isLoadingMore &&
                <View style={{ flex: 1, padding: 10 }}>
                  <ActivityIndicator size="small" />
                </View>
              );
            }}
            enableEmptySections /> : <View >
            <RkText style={styles.tipList}> {checkData === false ? I18n.t("no_data_to_display") : ""} </RkText>
          </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tipList: {
    color: KittenTheme.colors.disabled,
    margin: 10,
    alignSelf: 'center'
  },
})

function mapStateToProps(state) {
  const { loginRes, setting, userInfoRes } = state
  return { loginRes, setting, userInfoRes }
}

export default connect(mapStateToProps)(MyRequests);
