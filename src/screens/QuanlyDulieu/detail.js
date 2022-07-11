import React from "react";
import {View, TouchableOpacity, Button, ScrollView, SafeAreaView} from "react-native";
import {Audio, Video} from "expo-av";
import {RkText} from "react-native-ui-kitten";
import {API, COMMON_APP, CONSTANTS} from "../../constants";
import {styleContainer} from "../../stylesContainer";
import {KittenTheme} from "../../../config/theme";
import {Ionicons} from "@expo/vector-icons";
import {tw} from "react-native-tailwindcss";
import moment from "moment";
import FormGroup from "../base/formGroup";
import {Gallery} from "./../base/gallery";
import AudioPlay from './AudioPlay';
import AudioPlay1 from './AudioPlay1';
class DulieuDetail extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params} = navigation.state;
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
          Chi tiết dữ liệu
        </RkText>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isPlaying: false,
      status: {},
      isBuffering: false,
      soundAudio: null,
      totalTime: "",
      playingTime: "",
    };

    this.videoRef = React.createRef();
  }

  async componentDidMount() {
    const {params} = this.props.navigation.state;
    this.setState({data: params.data});
  }



  deleteImgFunc = async (uri) => {
    const {data} = this.state;
    if (data.hinhanh?.length > 0) {
      const hinhanhFilter = data.hinhanh?.filter((data) => {
        return data.source.uri !== uri;
      });

      // this.setState({ hinhanh, hinhanhUpload });
    }
  };



  render() {
    const {data, status, isPlaying, totalTime, playingTime} = this.state;
    let hinhanh = data?.hinhanh?.map(dt => {
      return {source: {uri: dt.img_uri}}
    })
    return (
      <SafeAreaView style={styleContainer.containerContent}>
        <ScrollView style={[tw.p4]}>
          <View>
            <FormGroup
              type={CONSTANTS.TEXT}
              value={data.nhanvien_id?.full_name}
              editable={false}
              placeholder={"Tên nhân viên"}
            />

            <FormGroup
              type={CONSTANTS.DATE_TIME}
              value={data.created_at}
              placeholder="Ngày upload"
              editable={false}
            />

            <View style={tw.pY1}>
              {data.hinhanh?.length > 0 && (
                <Gallery
                  items={hinhanh}
                  deleteImg={false}
                  navigation={this.props.navigation}
                  deleteImgFunc={this.deleteImgFunc}
                  containerStyle={tw.mTPx}
                />
              )}

              {(data?.video?.length > 0) && (
                <View>
                  <RkText rkType="header6">Video</RkText>
                  {
                    data?.video.map((video, idx) => {
                      console.log(video.video_uri, 'video.video_uri')
                      return <View key={idx}>
                        <Video
                          style={{width: 350, height: 300, marginTop: 10}}
                          source={{uri: video.video_uri}}
                          useNativeControls
                          resizeMode="contain"
                          isLooping={false}
                        />
                      </View>
                    })
                  }
                </View>
              )}
              {(data?.audio?.length > 0) && <View style={tw.mT4}>
                <RkText rkType="header6">Audio</RkText>
                {
                  data?.audio.map((audio, idx) => {
                    return <AudioPlay1 key={idx} data={audio.audio_uri}/>
                  })
                }
              </View>}

            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default DulieuDetail;
