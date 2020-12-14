import React, { Component } from "react";
import { View, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from "react-native";
import { styleContainer } from "../../stylesContainer";
import { CONSTANTS, API, COMMON_APP } from "../../constants";
import { REQUEST_DETAIL_PAGE } from "../../constants/router";
import { RkText } from "react-native-ui-kitten"
import { Ionicons } from "@expo/vector-icons";
import { KittenTheme } from "../../../config/theme";
import moment from "moment"
import { connect } from "react-redux"
import { fetchFavoriteRequest } from "../../epics-reducers/fetch/fetch-favorited.duck";
import Constants from 'expo-constants';
import CardCustom from "../base/card";
import I18n from '../../utilities/I18n';

class MyFavourites extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>{I18n.t("favorite_feedback_header")}</RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = ({
      localFavorited: []
    });
  }

  componentDidMount() {
    let query = ""
    if (this.props.tokenDecode.id) {
      query = "?page=1&limit=0&citizen_id=" + this.props.tokenDecode.id
    } else {
      query = "?page=1&limit=0&device_id=" + Constants.deviceId
    }
    this.props.dispatch(fetchFavoriteRequest(query))
  }

  componentDidUpdate(prevProps) {
    if (this.props.favorited !== prevProps.favorited) {
      if (this.props.favorited) {
        this.setState({
          localFavorited: this.props.favorited,
        })
      }
    }
  }

  onRefresh() {
    setTimeout(() => this.setState({ refreshing: false }), 501)
  }
  onPress(id) {
    this.props.navigation.navigate(REQUEST_DETAIL_PAGE, {
      id: id,
      type: CONSTANTS.VIEW,
      onGoBack: () => null
    })
  }

  render() {
    let checkData = this.state.localFavorited ? !!this.state.localFavorited.length : null
    return (
      <View style={styleContainer.containerContent}>
        <RkText style={{textAlign: 'center'}} rkType='header6'>{this.state.localFavorited.length + ' ' + I18n.t("feedback_found")}</RkText>
        <View style={{ flex: 1 }}>
          {this.state.localFavorited.length ?
            <FlatList
              style={styles.listViewContainer}
              data={this.state.localFavorited}
              renderItem={({ item: rowData, index: rowID }) => {
                let indexRow = parseInt(rowID) + 1
                let img = rowData.request_id.images_req[0] ? { uri: COMMON_APP.HOST_API + API.IMAGES.format(rowData.request_id.images_req[0]) } : CONSTANTS.IMAGE_DEFAULT_LARGE
                return <CardCustom
                  source={img}
                  title={rowData.request_id.title}
                  content={rowData.request_id.content}
                  time={moment(rowData.request_id.created_at).format(CONSTANTS.DATE_FORMAT)}
                  confirmed={rowData.request_id.confirmed}
                  indexRow={indexRow.toString()}
                  isPublic={rowData.request_id.isPublic}
                  onPress={() => this.onPress(rowData.request_id._id)} />
              }}
              keyExtractor={(item, index) => String(index)}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
              enableEmptySections /> : <View >
              <RkText style={styles.tipList}> {checkData === false ? I18n.t("no_data_to_display") : ""} </RkText>
            </View>}
        </View>
      </View>
    )
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
  const { favorited, tokenDecode } = state
  return { favorited, tokenDecode }
}

export default connect(mapStateToProps)(MyFavourites);
