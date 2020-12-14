import React from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import {Ionicons} from "@expo/vector-icons";
import {WebView} from 'react-native-webview';
import {RkText} from "react-native-ui-kitten";
import {styleContainer} from "../../stylesContainer";
import {getAll} from '../../epics-reducers/services/gioithieuServices'

export default class GioiThieu extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack(null)} style={{paddingHorizontal: 20}}>
          <Ionicons name="ios-arrow-back" size={20} color={'#00003c'}/>
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>
          Giới thiệu
        </RkText>
      )
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      gioithieu: ''
    }
  }
  async componentDidMount() {
    let gioithieuRes = await getAll();
    if(gioithieuRes){
      this.setState({gioithieu: gioithieuRes.gioithieu})
    }
  }

  render() {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          body {
            /*font-family: Lohit-Gujarati;*/
            font-size: 1.25rem;
            /*color: black;*/
            padding: 0px 10px 10px 10px;
          }
        </style>
      </head>
      <body>
        <p>${this.state.gioithieu}</p>
      </body>
      </html>`

    return (
      <View style={{flex: 1}}>
        <WebView originWhitelist={['*']}
                 source={{html: html, baseUrl: ''}}
        />
      </View>
    )
  }
}
