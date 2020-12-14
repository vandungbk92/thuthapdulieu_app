import React, {Component} from "react";
import {View, FlatList, TouchableOpacity, StyleSheet, ImageBackground} from "react-native";
import {styleContainer} from "../../stylesContainer";
import {RkText} from "react-native-ui-kitten"
import {Ionicons, FontAwesome5} from "@expo/vector-icons";
import ListItemCustom from '../Component/ListItemCustom';
import {KittenTheme} from "../../../config/theme";
import {connect} from "react-redux"
import I18n from '../../utilities/I18n';

import {
  MY_REQUESTS_PAGE,
  REQUESTS_PAGE,
  LOGIN_PAGE,
  CREATE_REQUEST_PAGE
} from '../../constants/router';
import { CONSTANTS } from "../../constants";
import {tw} from "react-native-tailwindcss";

class PhanHoiThanhHoa extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText}/>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>{'Phản ánh, kiến nghị'}</RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
  }

  navigateItem = (route) => () => {
    this.props.navigation.navigate(route);
  };

  renderRow(item) {
    return <TouchableOpacity
      style={[tw.flexRow, tw.p2, tw.rounded, tw.bgWhite]}
      onPress={this.navigateItem(item.page)}
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
          {item.name}
        </RkText>
        <RkText style={[tw.textSm, {color: KittenTheme.colors.blueGray}]}>{item.description}</RkText>
      </View>
    </TouchableOpacity>
    /*return (
      <ListItemCustom
        onPress={() => {
          this.props.navigation.navigate(item.page)
        }}
        title={item.name}
        leftIcon={{name: 'lightbulb-outline', size: 16, color: '#00003c'}}
      />
    );*/
  };

  render() {

    let {userInfoRes} = this.props
    return (
      <View style={[{flex: 1}, tw.bgWhite]}>
        <View style={{flex: 1}}>
          <ImageBackground source={CONSTANTS.BG_PHAN_ANH_SCREEN}
                           style={{width: '100%', height: '100%'}} resizeMode={'stretch'}>
          </ImageBackground>
        </View>
        <View style={{flex: 2}}>

          <FlatList
            data={[
              {
                _id: 1,
                name: 'TẠO MỚI PHẢN ÁNH, KIẾN NGHỊ',
                page: CREATE_REQUEST_PAGE,
                icon: 'file-alt',
                description: 'Giao diện tạo mới một phản ánh, kiến nghị',
                backgroundStyle: tw.bgTeal500,
              },
              {
                _id: 2,
                name: 'PHẢN ÁNH, KIẾN NGHỊ CỦA TÔI',
                page: userInfoRes && userInfoRes._id ? MY_REQUESTS_PAGE : LOGIN_PAGE,
                icon: 'address-book',
                description: 'Danh sách phản ánh, kiến nghị tài khoản đăng nhập đã tạo',
                backgroundStyle: tw.bgTeal500,
              },
              {
                _id: 3,
                name: 'DANH SÁCH PHẢN ÁNH, KIẾN NGHỊ',
                page: REQUESTS_PAGE,
                icon: 'list-ol',
                description: 'Tổng hợp danh sách phản ánh, kiến nghị trong tỉnh',
                backgroundStyle: tw.bgTeal500,
              }]}
            keyExtractor={a => a._id}
            renderItem={({item, index}) => this.renderRow(item)}
            contentContainerStyle={[tw.pT2]}
            ItemSeparatorComponent={() => <View style={[tw.mL16, tw.hPx, tw.bgGray300, tw.mY1]} />}
          />
        </View>
      </View>)
  }
}


function mapStateToProps(state) {
  const {setting, userInfoRes} = state
  return {setting, userInfoRes}
}

export default connect(mapStateToProps)(PhanHoiThanhHoa);
