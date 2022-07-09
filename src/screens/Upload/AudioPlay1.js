import React from "react";
import {View, TouchableOpacity, ScrollView, SafeAreaView} from "react-native";
import {Audio, Video} from "expo-av";
import {RkText} from "react-native-ui-kitten";
import {styleContainer} from "../../stylesContainer";
import {KittenTheme} from "../../../config/theme";
import {Ionicons, FontAwesome} from "@expo/vector-icons";
import {tw} from "react-native-tailwindcss";
class AudioPlay1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      status: {},
      soundAudio: null,
      totalTime: "",
      playingTime: "",
    };
  }

  async componentDidMount() {
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
  }

  async loadAudio() {
    const {isPlaying} = this.state;
    try {
      const soundAudio = new Audio.Sound();
      const source = {
        uri: this.props.data
      };
      const status = {
        shouldPlay: isPlaying,
      };

      soundAudio.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      await soundAudio.loadAsync(source, status, false);
      this.setState({soundAudio});
    } catch (e) {
      console.log(e);
    }
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    if(this.props.data !== prevProps.data){
      this.setState({isPlaying: false})
    }
  }

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      totalTime: this.getDurationFormatted(status.durationMillis),
      playingTime: this.getDurationFormatted(status.positionMillis),
    });

    /*if (status.isPlaying === false) {
      this.setState({
        isPlaying: status.isPlaying,
      });
    }*/
  };

  handlePlayPause = async () => {
    const {isPlaying, soundAudio} = this.state;
    isPlaying ? await soundAudio.pauseAsync() : await soundAudio.playAsync();

    this.setState({
      isPlaying: !isPlaying,
    });
  };

  handleRePlay = async () => {
    const {isPlaying, soundAudio} = this.state;
    await soundAudio.replayAsync()
    this.setState({
      isPlaying: true,
    });
  };

  getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  async componentWillUnmount(){
    const {isPlaying, soundAudio} = this.state;
    await soundAudio.pauseAsync()
    this.setState({
      isPlaying: false,
    });
  }
  uploadAudio = () => {
    this.props.getUriFile();
  }

  render() {
    const {isPlaying, totalTime, playingTime} = this.state;
    return (
      <SafeAreaView style={styleContainer.containerContent}>
        <ScrollView style={[tw.p4]}>
          <View>
            <View
              style={[
                tw.flexRow,
                tw.justifyBetween,
                tw.itemsCenter,
                tw.bgBlue200,
                tw.pX4,
                {height: 50, borderRadius: 16},
              ]}
            >
              <RkText>
                Bản ghi: {playingTime} - {totalTime}
              </RkText>
              <View style={tw.flexRow}>

                <TouchableOpacity
                  onPress={() => this.handleRePlay()}
                >
                  {
                    (!isPlaying && playingTime !== "0:00") || (playingTime === totalTime) ? <FontAwesome
                      name={"history"}
                      size={24}
                      color={KittenTheme.colors.appColor}
                      style={tw.mX2}
                    /> : null
                  }

                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.handlePlayPause()}
                >
                  {isPlaying ? (
                    <Ionicons
                      name={"pause"}
                      size={24}
                      color={KittenTheme.colors.appColor}
                      style={tw.mX2}
                    />
                  ) : (
                    <Ionicons
                      name={"play"}
                      size={24}
                      color={KittenTheme.colors.appColor}
                      style={tw.mX2}
                    />
                  )}

                </TouchableOpacity>


                {
                  this.props.record && <TouchableOpacity
                    onPress={this.uploadAudio}
                    style={tw.flexRow}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={24}
                      color={KittenTheme.colors.appColor}
                      style={tw.mX1}
                    />
                  </TouchableOpacity>
                }

              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default AudioPlay1;
