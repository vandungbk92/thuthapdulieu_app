import React from 'react';

import moment from 'moment';

import { tw } from 'react-native-tailwindcss';

import { View, ScrollView, TouchableOpacity } from 'react-native';

import { RkText, RkTabSet, RkTab } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';

import I18n from '../../utilities/I18n';
import * as ROUTER from '../../constants/router';

import Widget01 from './components/Widget01';

import WidgetTime from './components/WidgetTime';

import {
  getAll,
  getVietnam,
  getThanhHoa,
} from '../../epics-reducers/services/ncovidServices';

import { formatNumber } from '../../helper/numberFormat';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

export default class MedicalInfo extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => navigation.goBack(null)}
        >
          <Ionicons
            name="ios-arrow-back"
            size={20}
            color={KittenTheme.colors.primaryText}
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>
          {I18n.t('Thông tin dịch bệnh')}
        </RkText>
      ),
    };
  };
  
  state = {
    thegioi: {},
    vietnam: {},
    thanhhoa: {},
    isLoaded: false,
  };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    const thanhHoaData = await getThanhHoa();
    this.setState({ thanhhoa: thanhHoaData });

    const vietnamData = await getVietnam();
    this.setState({ vietnam: vietnamData });

    const thegioiData = await getAll();
    this.setState({ thegioi: thegioiData });

    this.setState({ isLoaded: true });
  };

  render() {
    if (this.state.isLoaded) {
      return (
        <View style={styleContainer.containerContent}>
          <RkTabSet>
            <RkTab title="Thanh Hoá" isLazyLoad={false}>
              <ScrollView
                style={tw.flex1}
                contentContainerStyle={[tw.pX4, tw.pY2]}
              >
                <View style={[tw.flexRow, tw.justifyBetween, tw.mB2]}>
                  <RkText style={tw.textBlue500}>Ngày: {this.state.thanhhoa?.ngay ? moment(this.state.thanhhoa?.ngay).format('DD/MM/yyyy') : ''}</RkText>
                  <TouchableOpacity
                    style={[]}
                    onPress={() =>
                      this.props.navigation.navigate(ROUTER.DICHBENH_THANHHOA)
                    }
                  >
                    <RkText style={tw.textBlue500}>Xem chi tiết</RkText>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    tw.flex1,
                    tw.p4,
                    tw.rounded,
                    tw.border,
                    tw.borderGray500,
                    tw.itemsCenter,
                    tw.bgGray100,
                  ]}
                >
                  <RkText style={[tw.uppercase, tw.textCenter]}>
                    SỐ CA NHIỄM BỆNH TRONG NGÀY
                  </RkText>
                  <RkText rkType="bold" style={[tw.textXl, tw.textRed500]}>
                    {formatNumber(this.state.thanhhoa?.so_ca_nhiem || 0)}
                  </RkText>
                </View>
                <View style={tw.h4} />
                <View style={tw.flexRow}>
                  <View
                    style={[
                      tw.flex1,
                      tw.p4,
                      tw.rounded,
                      tw.border,
                      tw.borderGray500,
                      tw.itemsCenter,
                      tw.bgGray100,
                      tw.justifyBetween,
                    ]}
                  >
                    <RkText style={[tw.uppercase, tw.textCenter]}>
                      SỐ CA NGHI NHIỄM BỆNH TRONG NGÀY
                    </RkText>
                    <RkText rkType="bold" style={[tw.textXl, tw.textRed500]}>
                      {formatNumber(this.state.thanhhoa?.so_ca_nghi_nhiem || 0)}
                    </RkText>
                  </View>
                  <View style={tw.w4} />
                  <View
                    style={[
                      tw.flex1,
                      tw.p4,
                      tw.rounded,
                      tw.border,
                      tw.borderGray500,
                      tw.itemsCenter,
                      tw.bgGray100,
                      tw.justifyBetween,
                    ]}
                  >
                    <RkText style={[tw.uppercase, tw.textCenter]}>
                      SỐ NGƯỜI ĐANG ĐIỀU TRỊ
                    </RkText>
                    <RkText rkType="bold" style={[tw.textXl, tw.textRed500]}>
                      {formatNumber(
                        this.state.thanhhoa?.tong_so_ca_dang_dieu_tri || 0,
                      )}
                    </RkText>
                  </View>
                </View>
                <View style={tw.h4} />
                <View style={tw.flexRow}>
                  <View
                    style={[
                      tw.flex1,
                      tw.p4,
                      tw.rounded,
                      tw.border,
                      tw.borderGray500,
                      tw.itemsCenter,
                      tw.bgGray100,
                      tw.justifyBetween,
                    ]}
                  >
                    <RkText style={[tw.uppercase, tw.textCenter]}>
                      SỐ NGƯỜI ĐÃ ĐƯỢC XÉT NGHIỆM
                    </RkText>
                    <RkText rkType="bold" style={[tw.textXl, tw.textGreen500]}>
                      {formatNumber(this.state.thanhhoa?.so_ca_xet_nghiem || 0)}
                    </RkText>
                  </View>
                  <View style={tw.w4} />
                  <View
                    style={[
                      tw.flex1,
                      tw.p4,
                      tw.rounded,
                      tw.border,
                      tw.borderGray500,
                      tw.itemsCenter,
                      tw.bgGray100,
                      tw.justifyBetween,
                    ]}
                  >
                    <RkText style={[tw.uppercase, tw.textCenter]}>
                      SỐ NGƯỜI ĐANG CÁCH LY
                    </RkText>
                    <RkText rkType="bold" style={[tw.textXl, tw.textRed500]}>
                      {formatNumber(this.state.thanhhoa?.so_nguoi_cach_ly || 0)}
                    </RkText>
                  </View>
                </View>
              </ScrollView>
            </RkTab>
            <RkTab title="Việt Nam" isLazyLoad={false}>
              <View style={[tw.flex1, tw.pX4, tw.pY2]}>
                <WidgetTime value={this.state.vietnam.updated} />
                <Widget01 data={this.state.vietnam} />
              </View>
            </RkTab>
            <RkTab title="Thế Giới" isLazyLoad={false}>
              <View style={[tw.flex1, tw.pX4, tw.pY2]}>
                <WidgetTime value={this.state.thegioi.updated} />
                <Widget01 data={this.state.thegioi} />
              </View>
            </RkTab>
          </RkTabSet>
        </View>
      );
    }
    return null;
  }
}
