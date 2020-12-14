import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert, Platform,
} from 'react-native';
import MapView, {
  Marker,
  ProviderPropType,
} from 'react-native-maps';

import {ASPECT_RATIO} from "../../constants/variable";
import Constants from "expo-constants";
import {showToast} from "../../epics-reducers/services/common";
import * as Permissions from "expo-permissions";
import * as Location from 'expo-location';
import I18n from "../../utilities/I18n";
import {THANH_HOA_BOUNDS} from "../../constants/polygon";
import {styleContainer} from "../../stylesContainer";
import {KittenTheme} from "../../../config/theme";
import {RkText} from "react-native-ui-kitten";

import {
  Ionicons
} from '@expo/vector-icons';

class MedicalAddressMap extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => (
        <TouchableOpacity
          style={styleContainer.headerButton}
          onPress={() => navigation.goBack(null)}
        >
          <Ionicons
            name="ios-arrow-back"
            size={20}
            color={KittenTheme.colors.primaryText}
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <RkText rkType="header4" style={styleContainer.headerTitle}>
          {I18n.t('Cơ sở y tế')}
        </RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
    let {docs, item} = props.navigation.state.params
    let markers = []

    let arrDocs = []
    if(Array.isArray(docs) && docs.length){
      docs.filter(data => {
        let chitiet = data.data ? data.data : [];
        arrDocs = [...arrDocs, ...chitiet]
      })
    }

    for(let i=0; i<arrDocs.length; i++){
      let data = arrDocs[i]

      if(data.lat && data.long && !isNaN(data.lat) && !isNaN(data.long)){
        let txt = ''
        if(data.dien_thoai){
          txt += 'SĐT: ' + data.dien_thoai + '.'
        }
        if(data.dia_chi){
          txt += ' ĐC: ' + data.dia_chi + '.'
        }
        let objData = {
          coordinate: {
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.long)
          },
          title: data.ten_co_so,
          description: txt
        }
        markers.push(objData)
      }
    }

    this.state = {
      cnt: 0,
      region: {
        latitude: item && !isNaN(item.lat) ? parseFloat(item.lat) : 19.807685,
        longitude: item && !isNaN(item.long) ? parseFloat(item.long) : 105.776748,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05 * ASPECT_RATIO
      },
      markers
    };
  }

  async componentDidMount() {
    let {item} = props.navigation.state.params;
    if(!item){
      if (Platform.OS === 'android' && !Constants.isDevice) {
        showToast('Oops, this will not work on Sketch in an Android emulator. Try it on your device!')
      } else {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
          showToast(I18n.t("please_enable_location_information_to_get_the_best_support"))
          this.getLocationAsync(false);
        } else {
          let {locationServicesEnabled} = await Location.getProviderStatusAsync()
          if (!locationServicesEnabled) {
            showToast(I18n.t("please_enable_location_information_to_get_the_best_support"))
            this.getLocationAsync(false);
          } else {
            this.getLocationAsync(true);
          }
        }
      }
    }
  }

  async getLocationAsync(perLocation) {
    try {
      let location
      if (perLocation) {
        let locationDevice = await Location.getCurrentPositionAsync({timeout: 5000});
        location = {
          latitude: locationDevice.coords.latitude,
          longitude: locationDevice.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05 * ASPECT_RATIO
        }
        this.getCurrentPositionDevice(location)

      } else {
        location = {
          latitude: 19.807685,
          longitude: 105.776748,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05 * ASPECT_RATIO
        }
        this.getCurrentPositionDevice(location)
      }

    } catch (e) {
      let location = {
        latitude: 19.807685,
        longitude: 105.776748,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05 * ASPECT_RATIO
      }
      this.getCurrentPositionDevice(location)
    }
  }

  getCurrentPositionDevice(location){
    let region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05 * ASPECT_RATIO
    }
    this.setState({region});
  }

  render() {
    const { region, markers } = this.state;

    if(!markers.length) return null;
    return (
      <View style={styles.container}>
        <MapView
          // provider={this.props.provider}
          style={styles.map}
          initialRegion={region}
          zoomTapEnabled={false}
          showsUserLocation={true}
          followsUserLocation={true} // tập trung vị trí người dùng
          showsMyLocationButton={true} // hiển thị button vị trí của tôi
          provider={MapView.PROVIDER_GOOGLE}
          minZoomLevel={8}
          maxZoomLevel={20}
        >
          {
            markers.map((data, i) => {
              return <Marker
                key={i}
                coordinate={data.coordinate}
                title={data.title}
                description={data.description}
              />
            })
          }

        </MapView>
      </View>
    );
  }
}

MedicalAddressMap.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  customView: {
    width: 140,
    height: 140,
  },
  plainView: {
    width: 60,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  calloutButton: {
    width: 'auto',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
});

export default MedicalAddressMap;
