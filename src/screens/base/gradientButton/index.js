import React from "react";
import {
  RkButton,
  RkText,
  RkComponent,
} from "react-native-ui-kitten";
import { StyleSheet, TouchableOpacity } from "react-native";
import { KittenTheme } from "../../../../config/theme";

export default class GradientButton extends RkComponent {
  componentName = "GradientButton";
  typeMapping = {
    button: {},
    gradient: {},
    text: {},
  };

  renderContent = () => {
    const hasText = this.props.text === undefined;
    return hasText ? this.props.children : this.renderText();
  };

  renderText = () => {
    if (typeof this.props.text === "string")
      return (
        <RkText style={styles.textStyle}>{this.props.text}</RkText>
      );
    return (
      this.props.text
    )
  }

  render() {
    const { style, rkType, ...restProps } = this.props;
    return (
      <RkButton
        rkType="stretch"
        style={[style]}
        {...restProps}
        touchable={(touchableProps) => <TouchableOpacity {...touchableProps} />}
      >
        {this.renderContent()}
      </RkButton>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    color: KittenTheme.colors.white
  }
})
