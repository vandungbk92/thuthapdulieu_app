import React, { Component } from "react";
import { AsyncStorage, View, StyleSheet, Image, ImageBackground, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { CONSTANTS } from "../../constants"
import { styleContainer } from "../../stylesContainer";
import { isEmpty } from "../../epics-reducers/services/common";
import { connect } from "react-redux"
import { fetchLoginSuccess, fetchLoginFailure } from "../../epics-reducers/fetch/fetch-login.duck";
import { fetchTokenDecode } from "../../epics-reducers/fetch/fetch-token.duck";
import * as Notifications from 'expo-notifications';
import { fetchUsersInfoRequest, fetchUsersInfoFailure } from "../../epics-reducers/fetch/fetch-users-info.duck";
import {
  MY_FAVORITED_PAGE,
  PROFILE_PAGE,
  LOGIN_PAGE,
  COVID_PAGE,
  NOTIFICATIONS_PAGE,
  CHI_TIET_THONG_BAO_PAGE,
  PHAN_HOI_PAGE,
  WEATHER_PAGE,
  THONG_BAO_PAGE, SU_KIEN_VAN_HOA, MEDICAL_REFLECTION, GIOI_THIEU, ANTOAN_THONGTIN, THONGTIN_TRUYENTHONG
} from '../../constants/router';
import getIn from 'lodash/get';
import JwtDecode from 'jwt-decode';
import HomeLogo from "./components/HomeLogo";
import HomeRight from "./components/HomeRight";
import HomeLeft from "./components/HomeLeft";
import I18n from '../../utilities/I18n';
import {KittenTheme} from "../../../config/theme";
import {SCREEN_HEIGHT, SCREEN_WIDTH, HEADER_HEIGHT, PLATFORM_IOS} from "../../constants/variable";
import {RkText} from "react-native-ui-kitten";
import {tw} from "react-native-tailwindcss";
import { FontAwesome5 } from '@expo/vector-icons';
import { getById as getHopThuById } from '../../epics-reducers/services/hopthucongdanServices';
import { getById as getThongbaoById } from '../../epics-reducers/services/thongbaoService';

function LogoTitle() {
  return (
    <View style={{ flexDirection: 'row', textAlign: 'center' }}>
      <Image
        source={CONSTANTS.LOGOx68PNG}
        style={styles.image}
      />
      <RkText rkType="header4">SMART - THANH HÓA</RkText>
    </View>
  );
}

class Home extends Component {
  static navigationOptions = () => ({
    headerLeft: () => <View />,
    headerTitle: () => <LogoTitle />,
  });

  constructor(props) {
    super(props);

    this.onInit = this.onInit.bind(this)
    this.changeLanguage = this.changeLanguage.bind(this)

    this.state = {
      items: [
        {
          icon: 'file-medical-alt',
          title: 'DỊCH BỆNH COVID-19',
          router: COVID_PAGE,
          description: 'Cập nhật thông tin mới về dịch bệnh Covid-19',
        },
        {
          icon: 'broadcast-tower',
          title: 'THÔNG TIN TRUYỀN THÔNG',
          router: THONGTIN_TRUYENTHONG,
          description: 'Thông tin truyền thông',
        },
        {
          icon: 'chalkboard-teacher',
          title: 'AN TOÀN THÔNG TIN',
          router: ANTOAN_THONGTIN,
          description: 'An toàn thông tin',
        },
        {
          icon: 'bell',
          title: 'THÔNG BÁO',
          router: THONG_BAO_PAGE,
          description: 'Danh sách thông báo',
        },
        // {
        //   icon: 'file-alt',
        //   title: 'PHẢN ÁNH, KIẾN NGHỊ TỈNH',
        //   router: PHAN_HOI_PAGE,
        //   description: 'Tổng hợp phản ánh kiến nghị của người dân trong tỉnh',
        // },
        {
          icon: 'cloud-sun',
          title: 'THỜI TIẾT',
          router: WEATHER_PAGE,
          description: 'Thời tiết 5 ngày gần nhất',
        },
        {
          icon: 'calendar-alt',
          title: 'LỊCH NGÀY LỄ, SỰ KIỆN TRONG TỈNH',
          router: SU_KIEN_VAN_HOA,
          description: 'Thời gian diễn ra ngày lễ, sự kiện của tỉnh',
        },
        {
          icon: 'info-circle',
          title: 'GIỚI THIỆU',
          router: GIOI_THIEU,
          description: 'Giới thiệu về ứng dụng Smart Thanh Hóa',
        },
      ],
      changeLanguage: false
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({
      tokenDecode: this.props.tokenDecode,
      notification: this.props.notification,
      changeLanguage: this.changeLanguage
    });
  }

  componentDidMount() {
    this.onInit();
    this.onPushNotify();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.notification.count !== nextProps.notification.count) {
      this.props.navigation.setParams({
        notification: nextProps.notification
      });
    }
    if (this.props.tokenDecode.id !== nextProps.tokenDecode.id) {
      this.props.navigation.setParams({
        tokenDecode: nextProps.tokenDecode
      });
    }
  }

  componentDidUpdate(prevProps) {
    let { loginRes } = this.props
    if (loginRes !== prevProps.loginRes) {
      try {
        if (!isEmpty(loginRes) && loginRes.token !== CONSTANTS.ERROR_AUTHEN) {
          let decoded = JwtDecode(loginRes.token);
          this.props.dispatch(fetchTokenDecode(decoded));
          this.props.dispatch(fetchUsersInfoRequest());
        } else {
          this.props.dispatch(fetchTokenDecode({}))
          this.props.dispatch(fetchUsersInfoFailure({}))
        }
      } catch (e) {
        this.props.dispatch(fetchTokenDecode({}))
        this.props.dispatch(fetchUsersInfoFailure({}))
      }
    }
  }

  componentWillUnmount() {
    this.notificationListener?.remove();
  }

  onInit() {
    try {
      AsyncStorage.getItem(CONSTANTS._CITIZEN_LOGIN_).then((userToken) => {
        if (typeof (userToken) === 'string') userToken = JSON.parse(userToken)
        if (this.checkTokenVaild(userToken)) {
          let decoded = JwtDecode(userToken.token);
          let current_time = new Date().getTime() / 1000;
          if (current_time < decoded.exp) {
            this.props.dispatch(fetchLoginSuccess(userToken))
          } else {
            this.props.dispatch(fetchLoginFailure({}))
          }
        } else {
          this.props.dispatch(fetchLoginFailure({}))
        }
      }).catch((error) => {
        this.props.dispatch(fetchLoginFailure({}))
      })
    } catch (error) {
      this.props.dispatch(fetchLoginFailure({}))
    }
  }

  onPushNotify() {
    this.notificationListener = Notifications.addNotificationResponseReceivedListener(async ({ notification }) => {
      const { title, body, data } = notification.request.content;
      if (data && data._id) {
        if (data.type) {
          const hopthuData = await getHopThuById(data._id);
          this.props.navigation.navigate(HOPTHU_CONGDAN_DETAIL, hopthuData);
        } else {
          const thongbaoData = await getThongbaoById(data._id);
          this.props.navigation.navigate(CHI_TIET_THONG_BAO_PAGE, { info_detail: thongbaoData });
        }
      }
    });
  }

  changeLanguage() {
    this.setState({ changeLanguage: !this.state.changeLanguage });
  }

  checkTokenVaild(loginRes) {
    if (!isEmpty(loginRes) && loginRes.token !== CONSTANTS.ERROR_AUTHEN) {
      return true;
    }
    return false;
  }

  onPress(route) {
    this.props.navigation.navigate(route)
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[tw.flexRow, tw.p2, tw.rounded, tw.bgWhite]}
        onPress={() => this.onPress(item.router)}
      >
        <View style={[tw.w12, tw.pT1, tw.itemsCenter]}>
          <FontAwesome5
            name={item.icon}
            size={26}
            solid={true}
            color={KittenTheme.colors.appColor}
          />
        </View>
        <View style={[tw.flex1, tw.pL1]}>
          <RkText rkType="bold" style={{color: KittenTheme.colors.appColor}}>
            {item.title}
          </RkText>
          <RkText style={[tw.textSm, {color:  KittenTheme.colors.blueGray}]}>
            {item.description}
          </RkText>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <ScrollView style={tw.bgWhite}>
        <ImageBackground
          style={[{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT / 3 }, tw.itemsCenter, tw.justifyCenter]}
          source={CONSTANTS.BG_PHAN_ANH_SCREEN}
        >
          <TouchableOpacity style={[tw.absolute, tw.flexRow, tw.pY3, tw.pX10, tw.rounded, tw.itemsCenter, { bottom: -20, backgroundColor: KittenTheme.colors.appColor }]}
                            onPress={() => this.onPress(MEDICAL_REFLECTION)}>
            <FontAwesome5 name="edit" size={16} soild={true} color="white" />
            <RkText style={[tw.mL2, tw.textWhite]}>Gửi phản ánh</RkText>
          </TouchableOpacity>
        </ImageBackground>
        <FlatList
          data={this.state.items}
          style={tw.mT4}
          renderItem={this.renderItem}
          keyExtractor={(item, i) => `item-${i}`}
          contentContainerStyle={[tw.pT2]}
          ItemSeparatorComponent={() => <View style={[tw.mL16, tw.hPx, tw.bgGray300, tw.mY1]} />}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  bgImage: {
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    opacity: 0.9
  },
  containerContent: {
    flexDirection: 'column',
    backgroundColor: KittenTheme.colors.white
  },
  view: {
    height: HEADER_HEIGHT,
  },
  layout: {
    flex: 1,
    flexDirection: 'row'
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 5
  },
})

function mapStateToProps(state) {
  const { loginRes, tokenDecode, notification, userInfoRes } = state;
  return { loginRes, tokenDecode, notification, userInfoRes };
}

export default connect(mapStateToProps)(Home);
