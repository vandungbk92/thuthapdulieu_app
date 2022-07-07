import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import {
  FontAwesome,
  Ionicons,

} from "@expo/vector-icons";
import { Audio } from "expo-av";
import { RkText } from "react-native-ui-kitten";
import { tw} from "react-native-tailwindcss";
import {KittenTheme} from "../../../../config/theme";
import { styleContainer } from "../../../stylesContainer";
import { showToast } from "../../../epics-reducers/services/common";
import { postFile } from './../../../epics-reducers/services/fileServices';
import moment from 'moment';
import { create } from "../../../epics-reducers/services/quanlydulieuServices";


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
    const currentTime = moment().toISOString();
    const data = await postFile(`${props.navigation.state.params.maNhanvien}`, showRecord.file, 'files', currentTime)
    if(data){
      showToast("Tải lên audio thành công!");
      let arrNameAudio = {};
      const objFiles = JSON.parse(data.body).files;
      const arrFilesName = objFiles?.files.map(e => e.filename);
      arrNameAudio = arrFilesName[0];
      const params = {
          audio: arrNameAudio,
          nhanvien_id: props.navigation.state.params.maNhanvien,
          ngayupload: currentTime,
          ghichu: props.navigation.state.params.ghichu,
          tendulieu: props.navigation.state.params.tendulieu,
      }
      const a = await create(params);
      showRecord.sound.unloadAsync()
      props.navigation.goBack();
    }else{
      showToast("Tải lên audio thất bại! Vui lòng thử lại");
    }
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
      return (
        <View style={[tw.flexRow, tw.justifyBetween, tw.itemsCenter, tw.bgWhite, tw.mX2, tw.pX4,{ height: 50, borderRadius: 16}]}>
          <RkText>
            Bản ghi - {showRecord.duration}
          </RkText>
          <View style={tw.flexRow}>
            <TouchableOpacity
              onPress={playSound}
              style={tw.flexRow}
            >
              <Ionicons
                name={"play"}
                size={24}
                color={KittenTheme.colors.appColor}
                style={tw.mX1}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={uploadAudio}
              style={tw.flexRow}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={24}
                color={KittenTheme.colors.appColor}
                style={tw.mX1}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    else return <View />;
  }

  return (
    <View style={styleContainer.containerContent}>
      <TouchableOpacity
        style={tw.selfCenter}
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
            <FontAwesome name="square" size={32} color="red" />
          ) : (
            <FontAwesome
              name="microphone"
              size={40}
              color="white"
            />
          )}
        </View>
      </TouchableOpacity>
      {getRecordingLines()}
    </View>
  )
}
