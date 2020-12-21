import React, {Component} from "react";
import {RkText} from "react-native-ui-kitten";
import {TouchableOpacity, View, SafeAreaView, StyleSheet} from "react-native";
import {styleContainer} from "../../stylesContainer";
import {CONSTANTS} from "../../constants"
import {getUserInfo, updateUserInfo} from "../../epics-reducers/services/userServices";
import GradientButton from "../base/gradientButton"
import {Ionicons} from "@expo/vector-icons";
import {KittenTheme} from "../../../config/theme";
import {checkValidate, showToast} from "../../epics-reducers/services/common";
import {fetchLogoutSuccess} from "../../epics-reducers/fetch/fetch-login.duck";
import {connect} from "react-redux"
import FormGroup from "../base/formGroup";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Avatar from "../base/avatar";
import {LOGIN_PAGE} from "../../constants/router";
import I18n from '../../utilities/I18n';
import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';

class UserProfile extends Component {
  static navigationOptions = ({navigation}) => {
    let {params} = navigation.state
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText}/>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>{I18n.t('citizen_info')}</RkText>
      ),
      headerRight: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => params ? params.handleRightPress() : null}>
          {params ? params.renderRightIcon(params.editable) : null}
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      userInfo: {full_name: "", email: "", phone: ""},
      profileChanged: false,
      editable: false,
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      handleLeftPress: () => this.handleLeftPress(),
      renderLeftIcon: () => this.renderLeftIcon(),
      handleRightPress: () => this.handleRightPress(),
      renderRightIcon: () => this.renderRightIcon(),
      editable: this.state.editable
    })
  }

  componentDidMount() {
    this.navigationSubscription = this.props.navigation.addListener('willFocus', async () => {
      let isFocused = this.props.navigation.isFocused();
      if (isFocused) {
        let userInfo = await getUserInfo()
        if (userInfo) {
          this.state.userInfo = userInfo
          this.setState(this.state)
        } else {
        }
      }
    });
  }

  componentWillUnmount() {
    this.navigationSubscription.remove();
  }

  async handleSaveInforUser() {
    if (!this.state.profileChanged) {
      this.setState({editable: false}, () => this.props.navigation.setParams({editable: false}))
      return
    }
    let dataValidate = [
      {type: CONSTANTS.REQUIRED, value: this.state.userInfo.full_name, alert: I18n.t('full_name')},
      {type: CONSTANTS.EMAIL, value: this.state.userInfo.email},
      {type: CONSTANTS.PHONE, value: this.state.userInfo.phone},
    ]
    if (!checkValidate(dataValidate)) return

    let dataReq = {
      full_name: this.state.userInfo.full_name,
      email: this.state.userInfo.email,
      phone: this.state.userInfo.phone,
    }
    let userInfo = await updateUserInfo(this.state.userInfo._id, dataReq)
    if (userInfo) {
      this.state.userInfo = userInfo
      this.state.editable = false
      this.state.profileChanged = false
      this.setState(this.state, () => this.props.navigation.setParams({editable: false}))
    } else {
    }
  }

  onPressLogout() {
    this.props.dispatch(fetchLogoutSuccess());
    this.props.navigation.navigate(LOGIN_PAGE);
  }

  changeElement(id, event) {
    this.state.userInfo[id] = event
    this.state.profileChanged = true
    this.setState(this.state)
  }

  handleLeftPress() {
    this.props.navigation.goBack(null)
  }

  handleRightPress() {
    this.state.editable ? this.handleSaveInforUser() : this.setState({editable: true}, () => this.props.navigation.setParams({editable: true}))
  }

  renderLeftIcon() {
    return (
      <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText}/>
    )
  }

  renderRightIcon() {
    return (
      <Ionicons name={this.state.editable ? "md-checkmark" : "md-create"} size={20}
                color={KittenTheme.colors.appColor}/>
    )
  }

  handleSelected(id, data) {
    this.state[id] = [data[0]._id]
    this.state.profileChanged = true
    this.setState(this.state)
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.section}>
            <Avatar img={CONSTANTS.IMAGE_PROFILE}/>
            <View style={{marginBottom: 20}}>
              <RkText rkType="primary1" style={{alignSelf: 'center'}}>{this.state.userInfo.username}</RkText>
              <RkText rkType="disabled light" style={{alignSelf: 'center'}}>{I18n.t('username')}</RkText>
            </View>
            <FormGroup type={CONSTANTS.TEXT}
                       required={true}
                       readOnly={!this.state.editable}
                       editable={this.state.editable}
                       id="full_name"
                       backgroundColor="transparent"
                       placeholder={I18n.t('full_name')}
                       value={this.state.userInfo.full_name || ""}
                       onChangeText={(id, value) => this.changeElement(id, value)}
                       labelIcon={<Ionicons name="ios-contact" size={20} color={KittenTheme.colors.appColor}/>}
            />
            <FormGroup type={CONSTANTS.TEXT}
                       required={true}
                       readOnly={!this.state.editable}
                       editable={this.state.editable}
                       id="phone"
                       backgroundColor="transparent"
                       placeholder={I18n.t('phone')}
                       keyboardType={'phone-pad'}
                       value={this.state.userInfo.phone || ""}
                       onChangeText={(id, value) => this.changeElement(id, value)}
                       labelIcon={<MaterialIcons name="phone" size={20} color={KittenTheme.colors.appColor}/>}

            />
            <FormGroup type={CONSTANTS.TEXT}
                       required={false}
                       readOnly={!this.state.editable}
                       editable={this.state.editable}
                       id="email"
                       autoCapitalize='none'
                       backgroundColor="transparent"
                       placeholder={I18n.t('email')}
                       value={this.state.userInfo.email || ""}
                       onChangeText={(id, value) => this.changeElement(id, value)}
                       labelIcon={<MaterialCommunityIcons name="email-open" size={20}
                                                          color={KittenTheme.colors.appColor}/>}

            />
          </View>
          <View style={styles.footer}>
            <GradientButton
              style={styleContainer.buttonGradient}
              text={I18n.t('logout')}
              onPress={this.onPressLogout.bind(this)}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KittenTheme.colors.white,
  },
  section: {
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  footer: {
    marginTop: 0,
    padding: 10,
    height: 100
  },
});

export default connect()(UserProfile);
