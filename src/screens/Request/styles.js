import {RkStyleSheet} from "react-native-ui-kitten";
import React, {NativeModules, Dimensions, Platform} from "react-native";
import {StyleSheet} from "react-native"
import { KittenTheme } from "../../../config/theme";

const dimensions = Dimensions.get("window");
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;
export const styles = RkStyleSheet.create(theme => ({
  detailContent: {
    padding: 10
  },
  viewImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageView: {
    width: imageWidth,
    height: imageHeight,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5
  },
  imageGet: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5
  },
  titleScreen: {
    color: "#db3839",
    justifyContent: "center",
    alignItems: "center",
  },
  containerTitle: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  desciptionText: {
    color: "#545454",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    marginVertical: 15,
    textAlign: "left",
    flex: 1
  },
  block: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
    justifyContent: "center",
    backgroundColor: KittenTheme.colors.white
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5
  },
  itemList: {
    flexDirection: "row",
  },
  label: {
  },
  screen: {
    backgroundColor: "transparent",
  },
  textInput: {
    flexDirection: "row",
    paddingHorizontal: 5,
    alignItems: "center",
    marginBottom: 10
  },
  listItems: {
    height: 45,
    backgroundColor: "#ffffff"
  },
  helpLinkText: {
    color: "#2e78b7",
  },
}));