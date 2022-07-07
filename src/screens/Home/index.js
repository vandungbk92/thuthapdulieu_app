import React from 'react';
import { View, Image, FlatList, TouchableOpacity } from 'react-native';
import { CONSTANTS } from '../../constants';
import { styleContainer } from '../../stylesContainer';
import {
  NOISOI_TAI,
  NOISOI_MUI,
  NOISOI_HONG,
  SOI_DA,
  NGHE_PHOI,
  UPLOAD_PAGE,
  QUAN_LY_DU_LIEU,
} from '../../constants/router';
import { KittenTheme } from '../../../config/theme';
import { RkText } from 'react-native-ui-kitten';
import { tw } from 'react-native-tailwindcss';
import { FontAwesome5 } from '@expo/vector-icons';

function LogoTitle() {
  return (
    <View style={[tw.flexRow, tw.itemsEnd]}>
      <Image style={[tw.w24, tw.h8]} source={CONSTANTS.LOGO_HOME} />
      <RkText style={[tw.mL1]} rkType="header4">
        THU THẬP DỮ LIỆU
      </RkText>
    </View>
  );
}

export default class Home extends React.Component {
  static navigationOptions = () => ({
    headerLeft: () => <View />,
    headerTitle: () => <LogoTitle />,
  });

  constructor(props) {
    super(props);

    this.state = {
      items: [
        {
          icon: 'chess-king',
          title: 'NỘI SOI TAI',
          router: NOISOI_TAI,
          description: 'Thu thập dữ liệu nội soi tai',
        },
        // {
        //   icon: 'chess-queen',
        //   title: 'NỘI SOI MŨI',
        //   router: NOISOI_MUI,
        //   description: 'Thu thập dữ liệu nội soi mũi',
        // },
        {
          icon: 'chess-knight',
          title: 'NỘI SOI HỌNG',
          router: NOISOI_HONG,
          description: 'Thu thập dữ liệu nội soi họng',
        },
        {
          icon: 'chess-rook',
          title: 'SOI DA',
          router: SOI_DA,
          description: 'Thu thập dữ liệu soi da',
        },
        {
          icon: 'chess-pawn',
          title: 'NGHE PHỔI',
          router: NGHE_PHOI,
          description: 'Thu thập dữ liệu nghe phổi',
        },
        {
          icon: 'file-upload',
          title: 'UPLOAD DỮ LIỆU',
          router: UPLOAD_PAGE,
          description: 'Thu thập dữ liệu trực tiếp',
        },
        {
          icon: 'file-upload',
          title: 'QUẢN LÝ DỮ LIỆU',
          router: QUAN_LY_DU_LIEU,
          description: 'Quản lý dữ liệu thu thập đc',
        },
      ],
    };
  }

  onPress(route) {
    this.props.navigation.navigate(route);
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[tw.flexRow, tw.p2, tw.rounded, tw.bgWhite]}
        onPress={() => this.onPress(item.router)}
      >
        <View style={[tw.pR1, tw.w12, tw.pT1, tw.itemsCenter]}>
          <FontAwesome5
            name={item.icon}
            size={26}
            solid={true}
            color={KittenTheme.colors.appColor}
          />
        </View>
        <View style={tw.flex1}>
          <RkText rkType="bold" style={{ color: KittenTheme.colors.appColor }}>
            {item.title}
          </RkText>
          <RkText style={[tw.textSm, { color: KittenTheme.colors.blueGray }]}>
            {item.description}
          </RkText>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styleContainer.containerContent}>
        <FlatList
          data={this.state.items}
          style={tw.mT4}
          renderItem={this.renderItem}
          keyExtractor={(item, i) => `item-${i}`}
          contentContainerStyle={[tw.pT2, tw.pX2]}
          ItemSeparatorComponent={() => (
            <View style={[/* tw.mL16, */ tw.hPx, tw.bgGray300, tw.mY1]} />
          )}
        />
      </View>
    );
  }
}
