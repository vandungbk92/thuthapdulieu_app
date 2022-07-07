import React from "react";
import { View, TouchableOpacity, Button } from "react-native";
import { Audio, Video } from "expo-av";
import { RkText } from "react-native-ui-kitten";
import { COMMON_APP, CONSTANTS } from "../../constants";
import { styleContainer } from "../../stylesContainer";
import { KittenTheme } from "../../../config/theme";
import { Ionicons } from "@expo/vector-icons";
import { tw } from "react-native-tailwindcss";
import moment from "moment";
import FormGroup from "../base/formGroup";
import { VIEW_IMAGE_PAGE } from "../../constants/router";
import { Gallery } from "./../base/gallery";
import GradientButton from "./../base/gradientButton/index";

class DulieuDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
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
    const { params } = this.props.navigation.state;
    this.setState({ data: params.data });
    if (params.data?.audio) {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
          shouldDuckAndroid: true,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: true,
        });
        this.loadAudio();
      } catch (e) {
        console.log(e);
      }
    }
  }

  // async playSound(uri) {
  //   const { data } = this.state;
  //   const sound = new Audio.Sound();
  //   try {
  //     await sound.loadAsync({
  //       uri:
  //         COMMON_APP.HOST_API +
  //         "/api/files/file/" +
  //         data.nhanvien_id._id +
  //         "---" +
  //         moment(data.ngayupload).format("YYYY-MM-DD") +
  //         "---" +
  //         uri,
  //     });
  //     await sound.playAsync();
  //     this.setState({ isPlaying: true });
  //     await sound.unloadAsync();
  //     // const { sound: soundObject, status } = await Audio.Sound.createAsync(
  //     //   {uri},
  //     //   { shouldPlay: true }
  //     // );
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // }

  async loadAudio() {
    const { isPlaying, data } = this.state;

    try {
      const soundAudio = new Audio.Sound();
      const source = {
        uri:
          COMMON_APP.HOST_API +
          "/api/files/file/" +
          data.nhanvien_id?._id +
          "---" +
          moment(data.ngayupload).format("YYYY-MM-DD") +
          "---" +
          moment(data.ngayupload).format("HH.mm.ss") +
          "---" +
          data.audio,
      };

      const status = {
        shouldPlay: isPlaying,
      };

      soundAudio.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      await soundAudio.loadAsync(source, status, false);
      this.setState({ soundAudio });
    } catch (e) {
      console.log(e);
    }
  }

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      totalTime: this.getDurationFormatted(status.durationMillis),
      playingTime: this.getDurationFormatted(status.positionMillis),
    });

    if (status.isPlaying === false) {
      this.setState({
        isPlaying: status.isPlaying,
      });
    }
    this.setState({
      isBuffering: status.isBuffering,
    });
  };

  handlePlayPause = async () => {
    const { isPlaying, soundAudio } = this.state;
    isPlaying ? await soundAudio.pauseAsync() : await soundAudio.playAsync();

    this.setState({
      isPlaying: !isPlaying,
    });
  };

  getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  deleteImgFunc = async (uri) => {
    const { data } = this.state;
    if (data.hinhanh?.length > 0) {
      const hinhanhFilter = data.hinhanh?.filter((data) => {
        return data.source.uri !== uri;
      });

      // this.setState({ hinhanh, hinhanhUpload });
    }
  };

  queryGetFile = (fileName) => {
    const { data } = this.state;
    return (
      COMMON_APP.HOST_API +
      "/api/files/file/" +
      data.nhanvien_id._id +
      moment(data.ngayupload).format("YYYY-MM-DD") +
      "---" +
      moment(data.ngayupload).format("HH.mm.ss") +
      "---" +
      fileName
    );
  };

  render() {
    const { data, status, isPlaying, totalTime, playingTime } = this.state;
    return (
      <View style={[tw.p4]}>
        <FormGroup
          type={CONSTANTS.TEXT}
          value={data.nhanvien_id?.full_name}
          editable={true}
          placeholder={"Tên nhân viên"}
        />

        <FormGroup
          type={CONSTANTS.DATE_TIME}
          value={data.ngayupload}
          placeholder="Ngày upload"
        />

        <View style={tw.pY1}>
          {data.hinhanh?.length > 0 && (
            <Gallery
              items={data.hinhanh?.map((hinhanh) => ({
                source: {
                  uri:
                    COMMON_APP.HOST_API +
                    "/api/files/file/" +
                    data.nhanvien_id._id +
                    "---" +
                    moment(data.ngayupload).format("YYYY-MM-DD") +
                    "---" +
                    moment(data.ngayupload).format("HH.mm.ss") +
                    "---" +
                    hinhanh,
                },
              }))}
              deleteImg={true}
              navigation={this.props.navigation}
              deleteImgFunc={this.deleteImgFunc}
              containerStyle={tw.mTPx}
            />
          )}
          {data.video && (
            <View>
              <Video
                ref={this.videoRef}
                style={{ alignSelf: "center", width: 350, height: 300 }}
                source={{
                  uri:
                    COMMON_APP.HOST_API +
                    "/api/files/file/" +
                    data.nhanvien_id._id +
                    "---" +
                    moment(data.ngayupload).format("YYYY-MM-DD") +
                    "---" +
                    moment(data.ngayupload).format("HH.mm.ss") +
                    "---" +
                    data.video,
                }}
                // useNativeControls
                resizeMode="contain"
                isLooping={false}
                onPlaybackStatusUpdate={(status) => this.setState({ status })}
              />
              <View
                style={[tw.flexRow, tw.justifyCenter, tw.itemsCenter, tw.p4]}
              >
                <GradientButton
                  text={status.isPlaying ? "Pause" : "Play"}
                  style={[tw.mT1, styleContainer.buttonGradient]}
                  onPress={() =>
                    status.isPlaying
                      ? this.videoRef.current.pauseAsync()
                      : this.videoRef.current.playAsync()
                  }
                />
              </View>
            </View>
          )}
          {data.audio && (
            <View
              style={[
                tw.flexRow,
                tw.justifyBetween,
                tw.itemsCenter,
                tw.bgWhite,
                tw.pX4,
                { height: 50, borderRadius: 16 },
              ]}
            >
              <RkText>
                Bản ghi: {playingTime} - {totalTime}
              </RkText>
              <View style={tw.flexRow}>
                <TouchableOpacity
                  // onPress={() => this.playSound(data.audio)}
                  onPress={() => this.handlePlayPause()}
                  style={tw.flexRow}
                >
                  {isPlaying ? (
                    <Ionicons
                      name={"pause"}
                      size={24}
                      color={KittenTheme.colors.appColor}
                      style={tw.mX1}
                    />
                  ) : (
                    <Ionicons
                      name={"play"}
                      size={24}
                      color={KittenTheme.colors.appColor}
                      style={tw.mX1}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default DulieuDetail;
