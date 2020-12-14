import React, { Component } from "react";
import { View, Image, StyleSheet } from "react-native";
import { RkButton, RkText, RkTextInput, } from "react-native-ui-kitten";
import GradientButton from "../base/gradientButton"
import { CONSTANTS } from "../../constants";
import { forgotPasswordMail } from "../../epics-reducers/services/accountServices";
import { checkValidate } from "../../epics-reducers/services/common";
import { KittenTheme } from "../../../config/theme";
import { styleContainer } from "../../stylesContainer";
import KeyboardView from "../base/formGroup/KeyBoardView";
import { DEVICE_HEIGHT, STATUS_BAR_HEIGHT } from "../../constants/variable";
import I18n from '../../utilities/I18n';
import Space from "../base/space";

class ForgotPassword extends Component {
  static navigationOptions = {
    headerShown: false
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      message: ''
    }
  }

  async onSendButtonPressed() {
    if (!checkValidate([{ value: this.state.email, type: CONSTANTS.EMAIL }])) return
    let sendEmail = await forgotPasswordMail({ email: this.state.email })
    if (sendEmail) {
      this.setState({message: I18n.t('please_visit_the_email_to_confirm_the_password')})
    }
  }

  onSignUpButtonPressed(value) {
    this.props.handleToggle(value)
  }

  handleElement(id, value) {
    this.state.message = ""
    this.state[id] = value
    this.setState(this.state)
  }

  render() {
    return (
      <KeyboardView>
        <View style={{ flexDirection: "column" }}>
          <View style={styles.header}>
            <Image style={styles.image} source={CONSTANTS.LOGO_LOGIN} />
          </View>

          <View style={styles.content}>
            <View style={styles.text}>
              {this.state.message ?
                <RkText rkType="success" style={{ textAlign: "center" }}>{this.state.message}</RkText> :
                <RkText rkType="disabled" style={{ textAlign: "center" }}>{I18n.t("please_enter_your_email_address_so_we_can_re_issue_your_password")}</RkText>
              }

            </View>
            <RkTextInput autoCapitalize='none' value={this.state.email} onChangeText={(email) => this.handleElement("email", email)}
              label={<RkText rkType="disabled">{"Email"}<Space/><RkText rkType="danger">{"*"}</RkText></RkText>} />

            <GradientButton
              style={styleContainer.buttonGradient}
              text={I18n.t('to_send')}
              onPress={this.onSendButtonPressed.bind(this)}
            />
            <View style={styles.textRow}>
              <RkButton rkType="clear" onPress={() => this.onSignUpButtonPressed(1)}>
                <RkText rkType="primary1">{I18n.t("back_to_login")}</RkText>
              </RkButton>
            </View>
          </View>
        </View>
      </KeyboardView>
    );
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
  text: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    //marginBottom: 10,
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
    //paddingBottom: 20
  },
  textRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
})
export default ForgotPassword;
