import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { RkText, RkTextInput } from 'react-native-ui-kitten';
import GradientButton from '../base/gradientButton';
import { CONSTANTS } from '../../constants';
import {
  fetchLoginRequest,
  fetchLoginSuccess,
  fetchLoginFailure,
} from '../../epics-reducers/fetch/fetch-login.duck';
import { connect } from 'react-redux';
import { styleContainer } from '../../stylesContainer';
import { KittenTheme } from '../../../config/theme';
import { checkValidate, isEmpty } from '../../epics-reducers/services/common';
import KeyboardView from '../base/formGroup/KeyBoardView';
import { APP_NAVIGATOR } from '../../constants/router';
import { DEVICE_HEIGHT, STATUS_BAR_HEIGHT } from '../../constants/variable';
import I18n from '../../utilities/I18n';
import JwtDecode from 'jwt-decode';
import { fetchTokenDecode } from '../../epics-reducers/fetch/fetch-token.duck';
import AsyncStorage from '@react-native-async-storage/async-storage';
class Login extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: 'tuan123',
      password: 'tuan123',
    };
  }

  async componentDidMount() {
    try {
      let userToken = await AsyncStorage.getItem(CONSTANTS._CITIZEN_LOGIN_);
      if (typeof userToken === 'string') userToken = JSON.parse(userToken);
      if (!isEmpty(userToken) && userToken.token !== CONSTANTS.ERROR_AUTHEN) {
        let decoded = JwtDecode(userToken.token);
        let current_time = new Date().getTime() / 1000;
        if (current_time < decoded.exp) {
          this.props.dispatch(fetchLoginSuccess(userToken));
        } else {
          this.props.dispatch(fetchLoginFailure({}));
        }
      } else {
        this.props.dispatch(fetchLoginFailure({}));
      }
    } catch (error) {
      this.props.dispatch(fetchLoginFailure({}));
    }
  }

  componentDidUpdate(prevProps) {
    let { loginRes } = this.props;
    if (loginRes !== prevProps.loginRes) {
      if (loginRes.token !== CONSTANTS.ERROR_AUTHEN) {
        try {
          let decoded = JwtDecode(loginRes.token);
          this.props.dispatch(fetchTokenDecode(decoded));
          this.props.navigation.navigate(APP_NAVIGATOR);
        } catch (error) {
        }
      }
    }
  }

  async onPressLogin() {
    let dataValidate = [
      { type: 'username', value: this.state.username },
      { type: 'password', value: this.state.password },
    ];

    if (!checkValidate(dataValidate)) return;

    this.props.dispatch(
      fetchLoginRequest({
        username: this.state.username,
        password: this.state.password,
      }),
    );
  }

  handleElement(id, value) {
    this.state[id] = value;
    this.setState(this.state);
  }

  render() {
    let { loginRes } = this.props;

    return (
      <KeyboardView>
        <View style={{ flexDirection: 'column' }}>
          <View style={styles.header}>
            <Image style={styles.image} source={CONSTANTS.LOGO_HOME} />
          </View>
          <View style={[styles.content, { flexDirection: 'column' }]}>
            <View>
              <RkTextInput
                label={I18n.t('username')}
                value={this.state.username}
                autoCapitalize="none"
                onChangeText={(username) =>
                  this.handleElement('username', username)
                }
              />
              <RkTextInput
                label={I18n.t('password')}
                value={this.state.password}
                onChangeText={(password) =>
                  this.handleElement('password', password)
                }
                secureTextEntry={true}
                autoCapitalize="none"
              />
              {loginRes && loginRes.token === CONSTANTS.ERROR_AUTHEN ? (
                <RkText rkType="danger">
                  {I18n.t('account_or_password_error')}
                </RkText>
              ) : null}
              <GradientButton
                style={styleContainer.buttonGradient}
                onPress={this.onPressLogin.bind(this)}
                text={I18n.t('login')}
              />
            </View>
          </View>
        </View>
      </KeyboardView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: (DEVICE_HEIGHT - STATUS_BAR_HEIGHT) / 3,
  },
  content: {
    height: ((DEVICE_HEIGHT - STATUS_BAR_HEIGHT) * 2) / 3,
    marginHorizontal: 20,
  },
  image: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  logoText: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderColor: KittenTheme.border.borderColor,
    backgroundColor: KittenTheme.colors.appColor,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

function mapStateToProps(state) {
  const { loginRes, loginReq } = state;
  return { loginRes, loginReq };
}

export default connect(mapStateToProps)(Login);
