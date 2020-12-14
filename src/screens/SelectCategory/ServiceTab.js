import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { RkText } from "react-native-ui-kitten"
import { KittenTheme } from "../../../config/theme";
import I18n from '../../utilities/I18n';
import { CREATE_REQUEST_PAGE } from "../../constants/router";

export default class ServiceTab extends Component {
  render() {
    let {services, type_request} = this.props
    return (
      <View style={styles.container}>
        {services.map((service, index) => {
          return (
            <TouchableOpacity key={index}
                              style={styles.listItems}
                              onPress={() => this.props.navigation.navigate(CREATE_REQUEST_PAGE, {service: service, type_request: type_request})}>
              <RkText rkType="primary2" style={styles.nodeCategories}>{service.name}</RkText>
            </TouchableOpacity>
          )
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  tipList: {
    color: KittenTheme.colors.disabled,
    margin: 10,
    alignSelf: 'center'
  },
  listItems: {
    height: 50,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    borderBottomWidth: KittenTheme.border.borderWidth,
    borderColor: KittenTheme.border.borderColor
  },
  nodeCategories: {
    color: KittenTheme.colors.primaryText,
  },
})

