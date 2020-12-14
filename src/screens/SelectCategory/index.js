import React, { Component } from "react";
import { TouchableOpacity, Linking, View, ScrollView, StyleSheet } from "react-native";
import { styleContainer } from "../../stylesContainer";
import ServiceTab from "./ServiceTab"
import { RkText } from "react-native-ui-kitten"
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { KittenTheme } from "../../../config/theme";
import {showToast} from "../../epics-reducers/services/common";
import I18n from '../../utilities/I18n';
import { connect } from "react-redux"
import {fetchServicesRequest} from "../../epics-reducers/fetch/fetch-services.duck";

class SelectCategory extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText} />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>{I18n.t("select_category")}</RkText>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = ({
      data: { citizen: [], enterprise: [] },
      indexActive: 1
    });

  }

  async componentDidMount() {
    try {

      const { dispatch, servicesRes } = this.props;

      if (!servicesRes) {
        dispatch(fetchServicesRequest());
      } else {
        let data = this.convertData(servicesRes)
        this.setState({ data });
      }

    } catch (error) {
      showToast(I18n.t('show_error'))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { servicesRes } = this.props;
    if (servicesRes !== prevProps.servicesRes && servicesRes && Array.isArray(servicesRes)) {
      let data = this.convertData(servicesRes)
      this.setState({ data });
    }
  }

  convertData(services) {
    let servicesData = { citizen: [], enterprise: [] };
    let citizen = []
    let enterprise = []

    services.filter(service => {
      let type = service.type ? service.type : []
      if (type.indexOf("1") >= 0) {
        citizen = [...citizen, service]
      }
      if(type.indexOf("2") >= 0){
        enterprise = [...enterprise, service]
      }
    })

    servicesData.citizen = citizen
    servicesData.enterprise = enterprise

    return servicesData
  }

  handleTab(value) {
    this.setState({indexActive: value})
  }

  render() {
    return (
      <View style={styleContainer.containerContent}>
        <View style={styles.groupButton}>

          <TouchableOpacity style={[styles.tabButton, (this.state.indexActive === 1 ? styles.active : styles.noneActive)]}
            onPress={() => this.handleTab(1)}>
            <Ionicons name="ios-contact" size={20} color={this.state.indexActive === 1 ? KittenTheme.colors.appColor : KittenTheme.colors.primaryText} />
            <RkText rkType="primary1" style={this.state.indexActive === 1 ? styles.textButtonActive : styles.textButtonNoneActive}>{I18n.t("citizen").toUpperCase()}</RkText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tabButton, (this.state.indexActive === 2 ? styles.active : styles.noneActive)]}
            onPress={() => this.handleTab(2)}>
            <MaterialIcons name="business" size={20} color={this.state.indexActive === 2 ? KittenTheme.colors.appColor : KittenTheme.colors.primaryText} />
            <RkText rkType="primary1" style={this.state.indexActive === 2 ? styles.textButtonActive : styles.textButtonNoneActive}>{I18n.t("enterprise").toUpperCase()}</RkText>
          </TouchableOpacity>

        </View>

        <ScrollView>
          {this.state.indexActive === 1 ? <ServiceTab services={this.state.data.citizen} type_request={"1"} navigation={this.props.navigation} /> : null}

          {this.state.indexActive === 2 ? <ServiceTab services={this.state.data.enterprise} type_request={"2"} navigation={this.props.navigation} /> : null}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  groupButton: { flexDirection: "row", marginBottom: 10, marginTop: 10 },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50
  },
  active: {
    backgroundColor: KittenTheme.colors.white,
    color: KittenTheme.colors.appColor,
    borderBottomWidth: 1,
    borderBottomColor: KittenTheme.colors.appColor
  },
  noneActive: {
    color: KittenTheme.colors.primaryText
  },
  textButtonActive: {
    alignSelf: "center",
    color: KittenTheme.colors.appColor
  },
  textButtonNoneActive: {
    alignSelf: "center",
    color: KittenTheme.colors.primaryText
  }
})

function mapStateToProps(state) {
  const { servicesRes } = state
  return { servicesRes }
}

export default connect(mapStateToProps)(SelectCategory);
