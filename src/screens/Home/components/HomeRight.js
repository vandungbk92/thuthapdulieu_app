import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Modal, FlatList, Picker } from 'react-native';
import { CONSTANTS } from "../../../constants/constants";
import { HEADER_HEIGHT, PLATFORM_IOS } from '../../../constants/variable';
import I18n, { I18nTranslate } from '../../../utilities/I18n';
import { KittenTheme } from '../../../../config/theme';
import { isEqual } from 'lodash';
import { RkText } from 'react-native-ui-kitten';
import Space from '../../base/space';
import Ionicons from '@expo/vector-icons/Ionicons';

// export default function HomeRight(props) {
//   return (
//     <View style={styles.view}>
//       <Image source={CONSTANTS.LOGOx68PNG} style={styles.image} />
//     </View>

//   )
// }

class HomeRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: I18n.getLanguage().locale,
      visible: false,
    }
    this.changeLanguage = this.changeLanguage.bind(this)

  }

  changeLanguage(lang) {
    if (!isEqual(lang, this.state.language)) {
      I18n.changeLanguage(lang);
      this.setState({
        visible: false,
        language: lang
      });
      this.props.changeLanguage()
    }
  }
  renderLabel() {
    return "Tiếng việt"
  }
  render() {
    let { language } = this.state
    if (PLATFORM_IOS) {
      let lang = language === 'en' ? 'vi' : 'en'
      //onPress={() => this.changeLanguage(lang)}
      return (
        <TouchableOpacity style={styles.view} >
          <RkText style={{ alignSelf: 'center' }}>
            {/*{language.toUpperCase()}*/}
          </RkText>
          <Space />
          <Image source={CONSTANTS.LOGOx68PNG} style={styles.image} />
        </TouchableOpacity>
      )
    }
    return (
      <View>
        {/*<Picker
          selectedValue={language}
          style={{ height: 50, width: 150 }}
          mode="dropdown"
          onValueChange={(lang) => this.changeLanguage(lang)}>
          {I18n.getLanguages().map((item, index) => {
            return (
              <Picker.Item label={item.name} value={item.locale} key={index} />
            )
          })}
        </Picker>*/}

        <TouchableOpacity style={[styles.view, {paddingHorizontal: 10, paddingVertical: 5}]}>
          <Image source={CONSTANTS.LOGOx68PNG} style={styles.image} />
        </TouchableOpacity>
      </View>

    );
  }
}



const styles = StyleSheet.create({
  view: {
    height: HEADER_HEIGHT,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  image: {
    width: HEADER_HEIGHT - (PLATFORM_IOS ? 24 : 10),
    height: HEADER_HEIGHT - (PLATFORM_IOS ? 24 : 10)
  },
  content: {
    padding: 5
  },
  title: {
    fontSize: 20,
    fontWeight: '500'
  },
  icon: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  iconWrapper: {
    borderWidth: 2,
    borderColor: KittenTheme.colors.white,
    borderRadius: 50
  },
  item: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10
  },
  flag: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },
  name: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center'
  },
  nameText: {
    fontSize: 14
  },
  separator: {
    height: 1,
    backgroundColor: KittenTheme.colors.blueGray_1
  }
})

export default HomeRight;

