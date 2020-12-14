import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { View, Platform } from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';

import I18n from '../../utilities/I18n';

import { KittenTheme } from '../../../config/theme';
import { dateFormatter } from '../../helper/dateFormat';

export default function DichteCardInfo(props) {
  const {
    hoten,
    benhnhanso,
    doituong,
    tinhtrang,
    diachi,
    thongtin,
    chitietdichte,
  } = props;

  return (
    <View style={[tw.p4]}>
      <View style={[tw.flexRow]}>
        <View
          style={[
            tw.w10,
            tw.h10,
            tw.bgGray200,
            tw.roundedFull,
            tw.itemsCenter,
            tw.justifyCenter,
          ]}
        >
          <Ionicons
            name="md-person"
            size={24}
            color={KittenTheme.colors.appColor}
          />
        </View>
        <RkText style={tw.p2}>
          {hoten} <RkText>({doituong})</RkText>
          {benhnhanso && <RkText>{` - BN${benhnhanso}`}</RkText>}
        </RkText>
      </View>
      <View style={[tw.mT2, tw._mL2]}>
        {tinhtrang && (
          <View style={tw.flexRow}>
            <Entypo
              name="dot-single"
              size={24}
              color={KittenTheme.colors.appColor}
            />
            <RkText style={Platform.select({ ios: tw.mT1, android: tw.mTPx })}>
              {tinhtrang}
            </RkText>
          </View>
        )}
        {diachi && (
          <View style={tw.flexRow}>
            <Entypo
              name="dot-single"
              size={24}
              color={KittenTheme.colors.appColor}
            />
            <RkText style={Platform.select({ ios: tw.mT1, android: tw.mTPx })}>
              {diachi}
            </RkText>
          </View>
        )}
        {thongtin && (
          <View style={tw.flexRow}>
            <Entypo
              name="dot-single"
              size={24}
              color={KittenTheme.colors.appColor}
            />
            <RkText style={Platform.select({ ios: tw.mT1, android: tw.mTPx })}>
              {thongtin}
            </RkText>
          </View>
        )}
      </View>
      {chitietdichte && chitietdichte.length > 0 && (
        <View style={[tw.hPx, tw.bgGray300]} />
      )}
      {chitietdichte &&
        chitietdichte.length > 0 &&
        chitietdichte.map((chitiet) => (
          <View key={chitiet._id} style={tw.mT2}>
            <View style={[tw.flexRow]}>
              <MaterialIcons
                name="person-pin"
                size={20}
                color={KittenTheme.colors.appColor}
              />
              <RkText style={tw.mL1} rkType="bold">
                {(chitiet.ngay &&
                  chitiet.denngay &&
                  `Từ ngày ${dateFormatter(
                    chitiet.ngay,
                  )} đến ngày ${dateFormatter(chitiet.denngay)}`) ||
                  (chitiet.ngay && `Ngày ${dateFormatter(chitiet.ngay)}`) ||
                  (chitiet.denngay &&
                    `Đến ngày ${dateFormatter(chitiet.denngay)}`) ||
                  ''}
              </RkText>
            </View>
            <View style={tw.mLPx}>
              <RkText style={tw.textGray700}>{chitiet.chitiet}</RkText>
            </View>
          </View>
        ))}
    </View>
  );
}
