import React, {Component} from "react";
import {ListItem} from "react-native-elements";

export default class ListItemCustom extends Component {
  render() {
    let {title, leftIcon, ...otherProps} = this.props


    return <ListItem
      onPress={() => this.prop.onPress}
      title={title}
      leftIcon={leftIcon}
      chevron
      bottomDivider
      titleStyle={{color: '#00003c', fontSize: 16}}
      subtitleStyle={{color: '#00003c', fontSize: 12}}
      containerStyle={{paddingVertical: 10}}
      {...otherProps}
    />

  }
}
