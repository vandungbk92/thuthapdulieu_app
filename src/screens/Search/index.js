import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { styleContainer } from "../../stylesContainer";
import { RkText } from "react-native-ui-kitten"
import { convertDataSelectLevelOne, convertStatusData, checkRangeOfDateTime, showToast, statusDataFnc } from "../../epics-reducers/services/common";
import { CONSTANTS } from "../../constants";
import moment from "moment"
import { Ionicons } from "@expo/vector-icons";
import { KittenTheme } from "../../../config/theme"
import GradientButton from "../base/gradientButton";
import FormGroup from "../base/formGroup"
import { connect } from "react-redux"
import Space from "../base/space";
import I18n from '../../utilities/I18n';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {fetchServicesRequest} from "../../epics-reducers/fetch/fetch-services.duck";
import { fetchDistrictsRequest } from '../../epics-reducers/fetch/fetch-district.duck';

class Search extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>{I18n.t("search")}</RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      servicesData: [],
      serviceSelected: [],
      districtData: [],
      districtSelected: [],
      statusData: [],
      statusSelected: [],
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

  async componentDidMount() {
    try {
      let { type } = this.props.navigation.state.params

      const { dispatch, servicesRes, districtsRes } = this.props;

      if (!servicesRes) {
        dispatch(fetchServicesRequest());
      } else {
        let servicesData = convertDataSelectLevelOne(servicesRes)
        this.setState({ servicesData });
      }

      /*if (!districtsRes) {
        dispatch(fetchDistrictsRequest());
      } else {
        let districtData = convertDataSelectLevelOne(districtsRes)
        this.setState({ districtData });
      }*/

      let statusData = convertStatusData(statusDataFnc(), type)
      this.setState({statusData})
    } catch (error) {
      showToast(I18n.t("show__error"))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { districtsRes, servicesRes } = this.props;
    /*if (districtsRes !== prevProps.districtsRes && districtsRes && Array.isArray(districtsRes)) {
      let districtData = convertDataSelectLevelOne(districtsRes)
      this.setState({ districtData });
    }*/

    if (servicesRes !== prevProps.servicesRes && servicesRes && Array.isArray(servicesRes)) {
      let servicesData = convertDataSelectLevelOne(servicesRes)
      this.setState({ servicesData });
    }
  }


  handleResetFilter() {
    this.state.statusSelected = []
    this.state.districtSelected = []
    this.state.serviceSelected = []
    this.state.startDate = ""
    this.state.startDateReal = ""
    this.state.endDate = ""
    this.state.endDateReal = ""
    this.state.searchTitle = ""
    this.setState(this.state)
  }

  handleApplyFilter() {
    if (!checkRangeOfDateTime(this.state.startDateReal, this.state.endDateReal)) return
    let { onGoBack } = this.props.navigation.state.params
    let { serviceSelected, districtSelected, statusSelected, startDateReal, endDateReal, searchTitle } = this.state
    onGoBack(serviceSelected[0], districtSelected[0], statusSelected[0], startDateReal, endDateReal, searchTitle)
    this.props.navigation.goBack(null)
  }

  handleSelected(id, data) {
    this.state[id] = [data[0]._id]
    this.setState(this.state)
  }
  changeElement(id, value) {
    this.state[id] = value
    if (id === 'startDate') this.state.startDateReal = moment(value).format(CONSTANTS.DATE_FORMAT_YYY_MM_DD)
    if (id === 'endDate') this.state.endDateReal = moment(value).format(CONSTANTS.DATE_FORMAT_YYY_MM_DD)
    this.setState(this.state)
  }
  handleElement(id, value) {
    this.state[id] = value
    this.setState(this.state)
  }
  render() {

    return (
      <View style={styleContainer.containerContent}>
        <ScrollView>
          <View style={[styles.searchContainer, { paddingTop: 10 }]}>
            <View style={{ marginBottom: 0 }}>
              <FormGroup type={CONSTANTS.TEXT}
                editable={true}
                id="searchTitle"
                backgroundColor="transparent"
                placeholder={I18n.t("keyword_search")}
                value={this.state.searchTitle || ""}
                onChangeText={(id, value) => this.handleElement(id, value)}
                labelIcon={<MaterialIcons name="title" color={KittenTheme.colors.appColor} size={20} />}
              />

              <FormGroup type={CONSTANTS.SELECT}
                selectText={I18n.t("category")}
                id="serviceSelected"
                value={this.state.servicesData}
                selectedItems={this.state.serviceSelected}
                single={true}
                showCancelButton={true}
                subKey={"children"}
                onSelectedItemsChange={(id, data) => this.handleSelected(id, data)}
                onConfirm={(id, data) => this.handleSelected(id, data)}
                onCancel={(id, data) => this.setState({ serviceSelected: this.state.serviceSelected })}
                labelIcon={<MaterialCommunityIcons name="file-document-box-multiple-outline" size={20} color={KittenTheme.colors.appColor} />}
              />

            </View>

            {/*<View style={{ marginBottom: 0 }}>
              <FormGroup type={CONSTANTS.SELECT}
                selectText={I18n.t("district")}
                id="districtSelected"
                value={this.state.districtData}
                selectedItems={this.state.districtSelected}
                single={true}
                showCancelButton={true}
                subKey={"children"}
                onSelectedItemsChange={(id, data) => this.handleSelected(id, data)}
                onConfirm={(id, data) => this.handleSelected(id, data)}
                onCancel={(id, data) => this.setState({ districtSelected: this.state.districtSelected })}
                labelIcon={<MaterialCommunityIcons name="earth" size={20} color={KittenTheme.colors.appColor} />}
              />

            </View>*/}

            <View style={{ marginBottom: 0 }}>
              <FormGroup type={CONSTANTS.SELECT}
                selectText={I18n.t("status")}
                id="statusSelected"
                value={this.state.statusData}
                selectedItems={this.state.statusSelected}
                single={true}
                showCancelButton={true}
                subKey={"children"}
                onSelectedItemsChange={(id, data) => this.handleSelected(id, data)}
                onConfirm={(id, data) => this.handleSelected(id, data)}
                onCancel={(id, data) => this.setState({ statusSelected: this.state.statusSelected })}
                labelIcon={<MaterialCommunityIcons name="clipboard-text-outline" size={20} color={KittenTheme.colors.appColor} />}

              />
            </View>
            <View style={[styles.pickerSelect]}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <FormGroup type={CONSTANTS.DATE_TIME}
                    readOnly={false}
                    id="startDate"
                    backgroundColor="transparent"
                    placeholder={I18n.t("start_date")}
                    dateFormat={this.props.setting.format_date}
                    value={this.state.startDate}
                    onChangeText={(id, value) => this.changeElement(id, value)}
                  />
                </View>
                <Space />
                <Ionicons name="ios-arrow-round-forward" style={{ alignSelf: 'center' }} size={20} color={KittenTheme.colors.appColor} />
                <Space />
                <View style={{ flex: 1 }}>
                  <FormGroup type={CONSTANTS.DATE_TIME}
                    readOnly={false}
                    id="endDate"
                    backgroundColor="transparent"
                    placeholder={I18n.t("end_date")}
                    dateFormat={this.props.setting.format_date}
                    value={this.state.endDate}
                    onChangeText={(id, value) => this.changeElement(id, value)}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonGroup}>
          <View style={styles.buttonItem}>
            <GradientButton
              style={styleContainer.buttonGradient}
              text={I18n.t("reset")}
              onPress={this.handleResetFilter.bind(this)} />
          </View>
          <View style={{ flex: 1 }}></View>
          <View style={styles.buttonItem}>
            <GradientButton
              style={styleContainer.buttonGradient}
              text={I18n.t("search")}
              onPress={this.handleApplyFilter.bind(this)} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerContent: {
    backgroundColor: "#fff",
  },
  searchContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  pickerSelect: {
    borderColor: "#d6d7da",
    justifyContent: "center",
  },
  buttonGroup: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    flexDirection: "row"
  },
  buttonItem: {
    flex: 4
  },
});


const mapStateToProps = (state) => {
  const { setting, servicesRes, districtsRes } = state
  return { setting, servicesRes, districtsRes }
};
export default connect(mapStateToProps)(Search);


