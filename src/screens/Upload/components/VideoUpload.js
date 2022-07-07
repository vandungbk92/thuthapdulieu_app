import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import { Camera } from "expo-camera";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { tw } from "react-native-tailwindcss";
import { styleContainer } from "../../../stylesContainer";
import { KittenTheme } from './../../../../config/theme';
import {postFile} from '../../../epics-reducers/services/fileServices';
import { showToast } from "../../../epics-reducers/services/common";
import moment from 'moment';
import { create } from "../../../epics-reducers/services/quanlydulieuServices";

export default function VideoUpload(props) {
  const [camera, setCamera] = React.useState(null);
  const [record, setRecord] = React.useState(null);
  const [type, setType] = React.useState(Camera.Constants.Type.back);
  const [visible, setVisible] = React.useState(false);
  const [uri, setUri] = React.useState(null);
  const [status, setStatus] = React.useState({});
  const [time, setTime] = React.useState(0);
  const video = React.useRef(null);


  const handleCamera = async () => {
    if (!record) {
      setVisible(false);
      setRecord(true);
      let video = await camera.recordAsync();
      setUri(video.uri);
    } else {
      setRecord(false);
      setVisible(true);
      camera.stopRecording();
    }
  };
  const uploadVideo = async () => {
    const currentTime = moment().toISOString();
    if (props.navigation.state.params.maNhanvien) {
      const data = await postFile(
        props.navigation.state.params.maNhanvien,
        uri,
        "files",
        currentTime
      );
      if (data) {
        showToast("Tải lên video thành công!");
        let arrNameVideo = {};
        const objFiles = JSON.parse(data.body).files;
        const arrFilesName = objFiles?.files.map(e => e.filename);
        arrNameVideo = arrFilesName[0];
        const params = {
            video: arrNameVideo,
            nhanvien_id: props.navigation.state.params.maNhanvien,
            ngayupload: currentTime,
            ghichu: props.navigation.state.params.ghichu,
            tendulieu: props.navigation.state.params.tendulieu,

        }
        const a = await create(params);
        props.navigation.goBack();
      } else {
        showToast("Tải lên video thất bại! Vui lòng thử lại");
        setVisible(false);
      }
    } else {
      showToast("Chưa nhập mã bệnh nhân");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {visible ? (
        <View style={tw.flex1}>
          <Video
            ref={video}
            style={{ flex: 1 }}
            source={{
              uri: uri,
            }}
            useNativeControls
            resizeMode="contain"
            isLooping={false}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
          <View style={[tw.flexRow, tw.justifyBetween, tw.itemsCenter]}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <View
                style={{
                  borderRadius: 25,
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 12,
                  marginHorizontal: 24,
                  backgroundColor: KittenTheme.colors.appColor,
                }}
              >
                <EvilIcons name="redo" size={40} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={uploadVideo}>
              <View
                style={{
                  borderRadius: 25,
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 12,
                  marginHorizontal: 24,
                  backgroundColor: KittenTheme.colors.appColor,
                }}
              >
                <Ionicons name="checkmark" size={40} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Camera
          style={{ flex: 1 }}
          type={type}
          ref={(ref) => {
            setCamera(ref);
          }}
        >
          <Text>{time}</Text>
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Ionicons
                  name={
                    Platform.OS === "ios"
                      ? "ios-camera-reverse-outline"
                      : "camera-reverse-outline"
                  }
                  size={40}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: "center",
                  alignItems: "center",
                }}
                onPress={handleCamera}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 25,
                    borderColor: "white",
                    height: 50,
                    width: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderRadius: 25,
                      borderColor: record ? "red" : "white",
                      height: 40,
                      width: 40,
                      backgroundColor: record ? "red" : "white",
                    }}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  alignSelf: "center",
                  alignItems: "center",
                }}
              />
            </View>
          </View>
        </Camera>
      )}
    </View>
  );
}
