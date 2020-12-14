import React, {Component} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Ionicons} from "@expo/vector-icons";
import {formatDateYMD} from '../../helper/dateFormat'
import {styleContainer} from "../../stylesContainer";
import {KittenTheme} from "../../../config/theme";
import {RkText} from "react-native-ui-kitten";
const testIDs = require('./testIDs');



export default class AgendaScreen extends Component {

  static navigationOptions = ({navigation}) => {
    let {params} = navigation.state
    return {
      headerLeft: () => (
        <TouchableOpacity style={styleContainer.headerButton} onPress={() => navigation.goBack(null)}>
          <Ionicons name="ios-arrow-back" size={20} color={KittenTheme.colors.primaryText}/>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>{'Lịch ngày lễ, sự kiện'}</RkText>
      )
    };
  };

  constructor(props) {
    super(props);

    let markedDates = {}
    let itemsOrg = {}

    let {docs} = props.navigation.state.params
    for(let i=0;i<docs.length;i++){
      let data = docs[i]
      if(data.nghi_keo_dai){
        let ngay_nghi = formatDateYMD(data.ngay_nghi)
        // items[ngay_nghi] = [{name: data.ten_ngay_nghi + ' -' + ngay_nghi}]
        // markedDates[ngay_nghi] = {selected: true, marked: true}

        let nghi_den_ngay = formatDateYMD(data.nghi_den_ngay)

        let dateClone = new Date(data.ngay_nghi);
        let copiedDate = new Date(dateClone.getTime());
        let dateCheck = ngay_nghi
        while(dateCheck <= nghi_den_ngay){
          itemsOrg[dateCheck] = [{name: data.ten_ngay_nghi + ' (' + ngay_nghi + ')'}]
          markedDates[dateCheck] = {selected: true, marked: true}

          //cộng endDate = dateClone + thêm 1 ngày.
          let endDate = new Date(copiedDate.setDate(copiedDate.getDate() + 1));
          dateCheck = formatDateYMD(endDate.toISOString())
        }

      }else{
        let ngay_nghi = formatDateYMD(data.ngay_nghi)
        let ngay_nghi_bu = formatDateYMD(data.ngay_nghi_bu)
        let ngay_lam_bu = formatDateYMD(data.ngay_lam_bu)

        itemsOrg[ngay_nghi] = [{name: data.ten_ngay_nghi + ' (' + ngay_nghi + ')'}]
        markedDates[ngay_nghi] = {selected: true, marked: true}
        if(ngay_nghi_bu){
          markedDates[ngay_nghi_bu] = {selected: true, marked: true}
          itemsOrg[ngay_nghi_bu] = [{name: data.ten_ngay_nghi + ' (nghỉ bù ngày ' + ngay_nghi + ')'}]
        }
        if(ngay_lam_bu){
          markedDates[ngay_lam_bu] = {selected: true, marked: true}
          itemsOrg[ngay_lam_bu] = [{name: data.ten_ngay_nghi + ' (làm bù ngày ' + ngay_nghi + ')'}]
        }
      }
    }

    this.state = {
      sukien: props.navigation.state.params.item,
      markedDates,
      items: {},
      itemsOrg
    };
  }

  render() {
    let {sukien, markedDates, itemsOrg} = this.state
    let selectedDate = sukien ? formatDateYMD(sukien.ngay_nghi) : formatDateYMD((new Date()).toISOString())
    let {params} = this.props.navigation.state
    return (
      <Agenda
        testID={testIDs.agenda.CONTAINER}
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        onDayChange={(day)=>{console.log(day, 'day changed')}}
        selected={selectedDate}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        markedDates={markedDates}
        minDate={params.minDate}
        maxDate={params.maxDate}
      />
    );
  }

  loadItems(day) {
    let {itemsOrg} = this.state
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          this.state.items[strTime].push({
            name: '',
          });
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {
        if(itemsOrg.hasOwnProperty(key)){
          newItems[key] = itemsOrg[key];
        }else{
          newItems[key] = this.state.items[key];
        }

      });
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  loadItemss(day) {
    setTimeout(() => {
      let {itemsOrg} = this.state
      let items = {}
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;

        // chuyển ngày hiện tại thành string.
        // 20 ngày sau đó.
        const strTime = this.timeToString(time);

        if (!this.state.items[strTime]) {
         items[strTime] = [{name: ''}];

          if(itemsOrg.hasOwnProperty(strTime)){
            items[strTime] = itemsOrg[strTime]
          }

        }
      }
      this.setState({items});
    }, 1000);
  }

  renderItem(item) {
    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item]}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
