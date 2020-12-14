import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { RkText } from "react-native-ui-kitten"
import { KittenTheme } from "../../../config/theme";
import I18n from '../../utilities/I18n';
import { CREATE_REQUEST_PAGE } from '../../constants/router';

export default class TabData extends Component {
  render() {

    return (
      <View style={styles.container}>
        {this.props.data ? this.props.data.map((category, index_data) => {
          if (category.options.length)
            return (
              <View key={index_data}>
                {category.options.map((service, index_list) => {
                  return (
                    <TouchableOpacity key={index_list} last={index_list === category.options.length - 1}
                      style={styles.listItems}
                      onPress={() => this.props.navigation.navigate(CREATE_REQUEST_PAGE, {
                        categoryId: category.id,
                        service: service
                      })}>
                      <RkText rkType="primary2" style={styles.nodeCategories}>{service.name}</RkText>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )
        }) : <View >
            <RkText style={styles.tipList}> {I18n.t('no_data_to_display')} </RkText>
          </View>}
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

