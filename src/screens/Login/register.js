import React, {Component} from "react";
import {View, Image, StyleSheet, SafeAreaView} from "react-native";
import {RkButton, RkText, RkTextInput,} from "react-native-ui-kitten";
import GradientButton from "../base/gradientButton"
import {CONSTANTS} from "../../constants";
import {styleContainer} from "../../stylesContainer";
import {checkValidate, clone, showToast, ingredientData} from "../../epics-reducers/services/common";
import {registerAccout} from "../../epics-reducers/services/accountServices";
import FormGroup from '../base/formGroup'
import Space from "../base/space";
import I18n from '../../utilities/I18n';
import {DEVICE_HEIGHT, STATUS_BAR_HEIGHT, PLATFORM_IOS} from "../../constants/variable";
import { KittenTheme } from "../../../config/theme";
import KeyboardAwareScrollView from '@pietile-native-kit/keyboard-aware-scrollview';

class Register extends Component {

  static navigationOptions = {
    headerShown: false
  };

  constructor(props) {
    super(props)
    this.state = {
      citizen: {type: "1"},
      ingredient: ingredientData(),
      ingredientSelected: ["1"]
    }
  }

  async onSignUpButtonPressed() {
    let check = [
      {value: this.state.citizen.full_name, type: CONSTANTS.REQUIRED, alert: I18n.t('full_name')},
      {value: this.state.citizen.phone, type: CONSTANTS.PHONE},
      {value: this.state.citizen.username, type: CONSTANTS.USERNAME},
      {value: this.state.citizen.password, type: CONSTANTS.PASSWORD},
      {value: this.state.citizen.confirm_password, type: CONSTANTS.PASSWORD}]
    if (!checkValidate(check)) return
    if (this.state.citizen.password !== this.state.citizen.confirm_password) {
      showToast(I18n.t('re_enter_the_password_incorrectly'))
      return
    }

    let citizenData = clone(this.state.citizen)
    let citizen = await registerAccout(citizenData)
    if (citizen) {
      showToast(I18n.t('sign_up_for_a_successful_account'))
      this.props.handleToggle(1)
    } else {

    }
  }

  onSignInButtonPressed() {
    this.props.handleToggle(1)
  }

  handleElement(id, value) {
    this.state.message = ""
    if(id ==='password' || id === 'phone'){
      this.state.citizen[id] = value ? value.trim() : '';
    }else{
      this.state.citizen[id] = value;
    }

    this.setState(this.state)
  }

  handleSelected(id, data) {
    this.state[id] = [data[0]._id]
    this.setState(this.state)
  }

  render() {
    return (
      <SafeAreaView style={{ flex:1, backgroundColor: KittenTheme.colors.white }}>
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Image style={styles.image} source={CONSTANTS.LOGO_LOGIN}/>
              <RkText rkType="disabled" style={styles.logoText}>{I18n.t('please_enter_the_information_below')}</RkText>
            </View>
            <View style={styles.content}>
              <FormGroup type={CONSTANTS.TEXT}
                        required={true}
                        editable={true}
                        id="full_name"
                        backgroundColor="transparent"
                        placeholder={I18n.t("full_name")}
                        value={this.state.citizen.full_name || ""}
                        onChangeText={(id, value) => this.handleElement(id, value)}
              />

              <FormGroup type={CONSTANTS.TEXT}
                         required={true}
                         editable={true}
                         id="phone"
                         backgroundColor="transparent"
                         placeholder={I18n.t("phone")}
                         keyboardType={'phone-pad'}
                         value={this.state.citizen.phone || ""}
                         onChangeText={(id, value) => this.handleElement(id, value)}
              />

              <FormGroup type={CONSTANTS.TEXT}
                        required={false}
                        editable={true}
                        id="email"
                        backgroundColor="transparent"
                        placeholder={I18n.t("email")}
                        autoCapitalize='none'
                        value={this.state.citizen.email || ""}
                        onChangeText={(id, value) => this.handleElement(id, value)}
              />

              <FormGroup type={CONSTANTS.TEXT}
                        required={true}
                        editable={true}
                        id="username"
                        backgroundColor="transparent"
                        placeholder={I18n.t("username")}
                        autoCapitalize='none'
                        value={this.state.citizen.username || ""}
                        onChangeText={(id, value) => this.handleElement(id, value)}
              />
              <FormGroup type={CONSTANTS.TEXT}
                        required={true}
                        secureTextEntry={true}
                        autoCapitalize = 'none'
                        editable={true}
                        id="password"
                        backgroundColor="transparent"
                        placeholder={I18n.t("password")}
                        value={this.state.citizen.password || ""}
                        onChangeText={(id, value) => this.handleElement(id, value)}
              />
              <FormGroup type={CONSTANTS.TEXT}
                        required={true}
                        secureTextEntry={true}
                        autoCapitalize = 'none'
                        editable={true}
                        id="confirm_password"
                        backgroundColor="transparent"
                        placeholder={I18n.t("re_password")}
                        value={this.state.citizen.confirm_password || ""}
                        onChangeText={(id, value) => this.handleElement(id, value)}
              />
              <GradientButton
                style={styleContainer.buttonGradient}
                text={I18n.t("register")}
                onPress={() => this.onSignUpButtonPressed()}
              />

              <View style={styles.footer}>
                <View style={styles.textRow}>
                  <RkButton rkType="clear" onPress={this.onSignInButtonPressed.bind(this)}>
                    <RkText rkType="primary1">{I18n.t("already_have_an_account_?_log_in")}</RkText>
                  </RkButton>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingVertical: PLATFORM_IOS ? 20 : 50
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  content: {
    marginHorizontal: 20,
    flex: 3
  },
  image: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },
  logoText: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 10
  },
  footer: {},
  textRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
})
export default Register;
