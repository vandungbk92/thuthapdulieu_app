import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { RkText, RkBadge } from 'react-native-ui-kitten'
import { KittenTheme } from "../../../../config/theme";
import {Ionicons} from "@expo/vector-icons";
import I18n from '../../../utilities/I18n';
import {styleContainer} from "../../../stylesContainer";

export default function HomeLeft(props) {
  return (
    <TouchableOpacity style={[styleContainer.headerButton, styles.container]} onPress={props.onPress}>
      <Ionicons name="md-notifications"
        size={32}
        color={KittenTheme.colors.appColor}
      />
      {props.badge > 0 &&
        <RkBadge
          title={String(props.badge > 99 ? '99+' : props.badge)}
          style={styles.badge}
        />
      }
    </TouchableOpacity>
  );

  // return (
  //   <View style={styles.view}>
  //     {/*<RkText rkType="header3" style={styles.t}>{I18n.t("P")}<RkText rkType="header4" style={styles.connect}>{I18n.t("hản ánh - kiến nghị")}</RkText></RkText>*/}
  //   </View>
  // )
}

const styles = StyleSheet.create({
  view: {
    marginHorizontal: 10
  },
  image: {

  },
  t: {
    color: KittenTheme.colors.appColor,
  },
  connect: {
    color: KittenTheme.colors.primaryText
  },
  container: {
    flexDirection: 'row',
    paddingVertical: 0,
  },
  badge: {
    right: 5,
    paddingLeft: 6,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: KittenTheme.colors.white,
    borderRadius: 9999,
  },
})
