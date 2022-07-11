import React from "react";
import { View, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { RkText } from "react-native-ui-kitten";
import { tw} from "react-native-tailwindcss";
import {KittenTheme} from "../../../../config/theme";
import { styleContainer } from "../../../stylesContainer";
import AudioPlay1 from '../AudioPlay1';

export default function AudioUpload(props) {
  const [recording, setRecording] = React.useState();
  const [showRecord, setShowRecord] = React.useState();
  const [message, setMessage] = React.useState("");

  async function startRecording() {
    setShowRecord(null);
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage(
          "Please grant permission to app to access microphone"
        );
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    const { sound, status } = await recording.createNewLoadedSoundAsync();
    let updatedRecordings = {
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    };
    setShowRecord(updatedRecordings);
  }

  const uploadAudio = async () => {
    props.navigation?.state?.params?.onGoBack(showRecord.file);
    props.navigation.goBack();
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  async function playSound() {
    await showRecord.sound.playAsync();
  }

  function getRecordingLines() {
    if (showRecord)
      return <AudioPlay1 data={showRecord.file} getUriFile={uploadAudio} record={true}/>
    else return <View />;
  }

  return (
    <View style={styleContainer.containerContent}>
      <TouchableOpacity
        style={[tw.flexCol, tw.itemsCenter, tw.mY4]}
        onPress={recording ? stopRecording : startRecording}
      >
        <View
          style={[tw.justifyCenter, tw.itemsCenter, tw.mY3, tw.mX6, tw.borderRed500,
            tw.border, {
            borderRadius: 35,
            backgroundColor: recording
              ? KittenTheme.colors.transparent
              : "red",
            height: 70,
            width: 70,
          }]}
        >
          {recording ? (
            <View>
              <FontAwesome name="square" size={32} color="red" />
            </View>
          ) : (
            <FontAwesome
              name="microphone"
              size={40}
              color="white"
            />
          )}
        </View>
        <View style={[tw.justifyCenter]}>
          {
            recording ? <RkText rkType="link">Đang ghi âm dữ liệu ...</RkText> : null
          }
        </View>
      </TouchableOpacity>
      {getRecordingLines()}
    </View>
  )
}

AudioUpload.navigationOptions = ({navigation}) => ({
  headerLeft: () => (
    <TouchableOpacity
      style={styleContainer.headerButton}
      onPress={() => navigation.goBack(null)}
    >
      <Ionicons
        name="ios-arrow-back"
        size={20}
        color={KittenTheme.colors.appColor}
      />
    </TouchableOpacity>
  ),
  headerTitle: () => <RkText rkType="header4">Audio</RkText>,
});