import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { RkText } from 'react-native-ui-kitten'
import { KittenTheme } from "../../../../config/theme";
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment'
import Space from '../space';
import Required from '../required';
import { CONSTANTS } from '../../../constants';
import { styleContainer } from '../../../stylesContainer';

export class DateTime extends Component {
  constructor(props) {
    super(props),
      this.state = {
        isShowDateTime: false,
      };
  }

  // showDatetime() {
  //     if (this.props.props.editable === false) return
  //     this.setState({ isShowDateTime: bolean })
  // }

  showDatetime(bolean, editable) {
    if (editable === false) return
    this.setState({ isShowDateTime: bolean })
  }

  handleDatePicked(id, type, date) {
    let { onChangeText } = this.props.props
    if (type === CONSTANTS.CONFIRM) {
      onChangeText ? onChangeText(id, date) : null
      this.showDatetime(false)
    }
    if (type === CONSTANTS.CANCEL) {
      this.showDatetime(false)
    }
  }

  render() {
    let { props } = this.props
    let valueShow = props.value ? moment(props.value).format(props.format || 'DD/MM/YYYY') : <Space />//("Chọn " + props.placeholder)
    return (
      <View style={[styles.viewContainer, styleContainer.boxShadow, props.containerStyle]}>
        <View style={styles.group}>
          {props.labelIcon ? <View style={styles.labelIcon}>
            {props.labelIcon}
          </View> : null}

          {props.readOnly === true ? <View style={styles.readOnly}>
            <View>
              <RkText rkType="primary2">{props.placeholder}<Space /></RkText>
            </View>
            <View style={{ flex: 1 }}>
              <RkText rkType="primary2 disabled" style={{ textAlign: 'right' }}>{valueShow}</RkText>
            </View>
          </View>
            :
            <TouchableOpacity
              onPress={() => this.showDatetime(true, props.editable)}>
              <View style={[styles.readOnly/* , props.contentStyle */]}>
                <View>
                  <RkText rkType="primary2 disabled">{props.placeholder}<Required required={props.required} /><Space /></RkText>
                </View>
                <View style={[{ paddingVertical: 4 }, props.contentStyle]}>
                  <RkText rkType="" style={{ textAlign: 'left' }}>{valueShow}</RkText>
                </View>
              </View>
            </TouchableOpacity>
          }
          <DateTimePicker
            isVisible={this.state.isShowDateTime}
            onConfirm={(date) => this.handleDatePicked(props.id, CONSTANTS.CONFIRM, date)}
            onCancel={(date) => this.handleDatePicked(props.id, CONSTANTS.CANCEL, date)}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    marginBottom: 5,
    backgroundColor: KittenTheme.colors.white,
    borderColor: KittenTheme.border.borderColor,
    borderWidth: KittenTheme.border.borderWidth,
    borderRadius: KittenTheme.border.borderRadius,
  },
  group: {
    flexDirection: "column",
    backgroundColor: KittenTheme.colors.white,
    borderRadius: KittenTheme.border.borderRadius,
    padding: 5
  },
  view: { flexDirection: "row", flex: 1 },
  labelIcon: { alignSelf: "center", flex: 1 },
  viewText: { backgroundColor: "#ffffff", flex: 9 },
  placeholderIcon: { flex: 1, alignSelf: "center" },
  readOnly: { flexDirection: 'column' },
})