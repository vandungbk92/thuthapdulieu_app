import React, { Component } from "react";
import {View, Image, KeyboardAvoidingView, Platform, StyleSheet, UIManager} from "react-native";
import { RkButton, RkText, RkTextInput, } from "react-native-ui-kitten";
import GradientButton from "../base/gradientButton"
import { CONSTANTS } from "../../constants";
import { fetchLoginRequest, fetchLoginSuccess } from "../../epics-reducers/fetch/fetch-login.duck";
import ForgotPassword from "./forgotPassword"
import Register from "./register"
import { connect } from "react-redux"
import { styleContainer } from "../../stylesContainer";
import { KittenTheme } from "../../../config/theme";
import { checkValidate, showToast } from "../../epics-reducers/services/common";
import KeyboardView from "../base/formGroup/KeyBoardView";
import { DEVICE_HEIGHT, STATUS_BAR_HEIGHT } from "../../constants/variable";
import Space from "../base/space";
import I18n from '../../utilities/I18n';
import JwtDecode from 'jwt-decode'
import * as PushNotify from '../../utilities/PushNotify';
import { fetchTokenDecode } from "../../epics-reducers/fetch/fetch-token.duck";

class Login extends Component {
  static navigationOptions = {
    headerShown: false
  };

  constructor(props) {
    super(props);
    this.state = {
      formToggle: 1,
      username: "", // "lenam",
      password: "", // "123456",
      deviceToken: PushNotify.getDeviceToken()
    };
  }

  componentDidUpdate(prevProps) {
    let { loginRes } = this.props
    if (loginRes !== prevProps.loginRes) {
      if (loginRes.token !== CONSTANTS.ERROR_AUTHEN) {
        let decoded = JwtDecode(loginRes.token);
        this.props.dispatch(fetchTokenDecode(decoded))
        this.props.navigation.goBack(null);
      }
    }
  }

  handleToggle(formToggle) {
    this.setState({ formToggle })
  }

  async onPressLogin() {
    let dataValidate = [
      { type: "username", value: this.state.username },
      { type: "password", value: this.state.password }
    ]

    if (!checkValidate(dataValidate)) return;

    this.props.dispatch(
      fetchLoginRequest({
        "username": this.state.username,
        "password": this.state.password,
        "deviceToken": this.state.deviceToken,
      })
    );
  }

  handleElement(id, value) {
    this.state[id] = value
    this.setState(this.state)
  }

  onSignUpButtonPressed(formToggle) {
    this.state.formToggle = formToggle
    this.setState(this.state)
  }

  render() {
    if (this.state.formToggle === 2) {
      return <Register handleToggle={this.handleToggle.bind(this)} />
    }
    if (this.state.formToggle === 3) {
      return <ForgotPassword handleToggle={this.handleToggle.bind(this)} />
    }

    let {loginRes} = this.props
    return (
      <KeyboardView>
        <View style={{ flexDirection: "column" }}>
          <View style={styles.header}>
            <Image style={styles.image} source={CONSTANTS.LOGO_LOGIN} />
          </View>
          <View style={[styles.content, { flexDirection: 'column' }]}>
            <View>
              <RkTextInput
                label={I18n.t('username')}
                value={this.state.username}
                autoCapitalize='none'
                onChangeText={(username) => this.handleElement("username", username)} />

              <RkTextInput
                label={I18n.t('password')}
                value={this.state.password}
                onChangeText={(password) => this.handleElement("password", password)}
                secureTextEntry={true}
                autoCapitalize='none'
              />

              {
                loginRes && loginRes.token === CONSTANTS.ERROR_AUTHEN ? <RkText rkType="danger">{I18n.t("account_or_password_error")}</RkText> : null
              }

              <GradientButton
                style={styleContainer.buttonGradient}
                onPress={this.onPressLogin.bind(this)}
                text={I18n.t("login")} />
            </View>

            <View style={styles.footer}>
              <View style={styles.textRow}>
                <RkButton rkType="clear" onPress={() => this.onSignUpButtonPressed(2)}>
                  <RkText rkType="primary1">{I18n.t("no_account_?")}<Space /><RkText rkType="primary1" style={{ color: KittenTheme.colors.appColor }}>{I18n.t('register_now')}</RkText></RkText>
                </RkButton>
              </View>
              <View style={styles.textRow}>
                <RkButton rkType="clear" onPress={() => this.onSignUpButtonPressed(3)}>
                  <RkText rkType="primary1">{I18n.t("forgot_password_?")}</RkText>
                </RkButton>
              </View>
              <View style={[styles.textRow, { marginTop: 30 }]}>
                <RkButton rkType="clear" onPress={() => this.props.navigation.goBack(null)}>
                  <RkText rkType="primary1">{I18n.t('back')}</RkText>
                </RkButton>
              </View>
            </View>
          </View>
        </View>
      </KeyboardView>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    height: (DEVICE_HEIGHT - STATUS_BAR_HEIGHT) / 3
  },
  content: {
    height: (DEVICE_HEIGHT - STATUS_BAR_HEIGHT) * 2 / 3,
    marginHorizontal: 20
  },
  image: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },
  logoText: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center'

  },
  button: {
    borderColor: KittenTheme.border.borderColor,
    backgroundColor: KittenTheme.colors.appColor,
    width: 50,
    height: 50,
    borderRadius: 50
  },
  footer: {

  },
  textRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
})

function mapStateToProps(state) {
  const { loginRes, loginReq } = state
  return { loginRes, loginReq }
}

export default connect(mapStateToProps)(Login);
