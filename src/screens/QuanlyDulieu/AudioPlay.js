import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

export default function AudioPlay() {
  const [sound, setSound] = React.useState();
  const [isPlaying] = React.useState(false);
  async function playSound() {


    const { sound } = await Audio.Sound.createAsync(
      {uri: "http://192.168.1.217:8080/server/uploads/2022/7/7/bensound-erf_1657185286632.mp3"}
    );
    setSound(sound);
    await sound.playAsync(); }

  React.useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
