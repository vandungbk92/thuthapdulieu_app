import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Button,
  Platform
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import ImageTile from './ImageTile';
const { width } = Dimensions.get('window')
import { PLATFORM_IOS } from '../../../../constants/variable';

export default class ImageBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      selected: {},
      after: null,
      has_next_page: true
    }
  }

  componentDidMount() {
    this.getPhotos()
  }

  selectImage = (index) => {
    let newSelected = {...this.state.selected};
    if (newSelected[index]) {
      delete newSelected[index];
    } else {
      newSelected[index] = true
    }
    if (Object.keys(newSelected).length > this.props.max) return;
    if (!newSelected) newSelected = {};
    this.setState({ selected: newSelected })
  }

  getPhotos = () => {
    let params = { first: 500, assetType: "Photos" };
    if(Platform.OS === 'ios'){
      params.groupTypes = "All"
    }
    if (this.state.after) params.after = this.state.after
    if (!this.state.has_next_page) return

    MediaLibrary.getAssetsAsync(params).then(this.processPhotos)

    /*CameraRoll
      .getPhotos(params)
      .then(this.processPhotos)*/
  }

  convertPhUriToAssetLibrary = (uri) => {
    const ext = 'jpg';
    return `assets-library://asset/asset.${ext}?id=${uri.replace('ph://', '')}&ext=${ext}`;
  };

  checkPhUri = (uri) => {
    if (uri.indexOf('ph://') !== -1) return true;
    else return false;
  }

  processPhotos = (r) => {
    if (this.state.after === r.endCursor) return;
    let uris = r.assets.map((i) => {
      if (PLATFORM_IOS && this.checkPhUri(i.uri))
        return this.convertPhUriToAssetLibrary(i.uri);
      else return i.uri;
    });
    this.setState({
      photos: [...this.state.photos, ...uris],
      after: r.endCursor,
      has_next_page: r.hasNextPage
    });
  }

  getItemLayout = (data,index) => {
    let length = width/4;
    return { length, offset: length * index, index }
  }

  prepareCallback() {
    let { selected, photos } = this.state;
    let selectedPhotos = photos.filter((item, index) => {
      return(selected[index])
    });
    let files = selectedPhotos
      .map(i => FileSystem.getInfoAsync(i, {md5: true}))
    let callbackResult = Promise
      .all(files)
      .then(imageData=> {
        return imageData.map((data, i) => {
          return {file: selectedPhotos[i], ...data}
        })
      })

    this.props.callback(callbackResult)
  }

  renderHeader = () => {
    let selectedCount = Object.keys(this.state.selected).length;
    let headerText = selectedCount + ' Selected';
    if (selectedCount === this.props.max) headerText = headerText + ' (Max)';
    return (
      <View style={styles.header}>
        <Button
          title="Close"
          onPress={() => this.props.callback(Promise.resolve([]))}
        />
        <Text>{headerText}</Text>
        <Button
          title="Done"
          onPress={() => this.prepareCallback()}
        />
      </View>
    )
  }

  renderImageTile = ({item, index}) => {
    let selected = this.state.selected[index] ? true : false
    return(
      <ImageTile
        item={item}
        index={index}
        camera={false}
        selected={selected}
        selectImage={this.selectImage}
      />
    )
  }
  renderImages() {
    return(
      <FlatList
        data={this.state.photos}
        numColumns={4}
        renderItem={this.renderImageTile}
        keyExtractor={(_,index) => index}
        onEndReached={()=> {this.getPhotos()}}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text>Loading...</Text>}
        initialNumToRender={24}
        getItemLayout={this.getItemLayout}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderImages()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 20
  },
})
