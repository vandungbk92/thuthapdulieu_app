import { Dimensions, StyleSheet } from 'react-native';
import { Header } from 'react-navigation-stack';

import { KittenTheme } from '../../../config/theme';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  mt5: {
    marginTop: 5
  },
  ml5: {
    marginLeft: 5
  },
  mr10: {
    marginRight: 10
  },
  circleWrapper: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    alignItems: 'center'
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: KittenTheme.colors.error
  },
  circle1: {
    width: 10,
    height: 10,
    marginLeft: 10,
    borderRadius: 9999,
    backgroundColor: KittenTheme.colors.blueGray_2
  },
  circle2: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: KittenTheme.colors.warning
  },
  circle3: {
    width: 4,
    height: 4,
    marginLeft: 5,
    borderRadius: 9999,
    backgroundColor: KittenTheme.colors.blueGray_2
  },
  circle4: {
    width: 6,
    height: 6,
    marginLeft: 60,
    borderRadius: 9999,
    backgroundColor: KittenTheme.colors.appColor
  },
  separator: {
    height: 1,
    backgroundColor: KittenTheme.colors.blueGray_2
  },
  listView: {
    width,
    height: height - Header.HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyView: {
    width: 65,
    height: 60
  },
  waitingView: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notifyImage: {
    width: 60,
    height: '100%',
    resizeMode: 'contain'
  },
  notifyContent: {
    flex: 1,
    flexDirection: 'column'
  },
  backSwipeRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  frontSwipeRow: {
    flex: 1,
    padding: 10,
    flexDirection: 'row'
  },
  headerButton: {
    paddingHorizontal: 10
  },
  removeButton: {
    width: 80,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: KittenTheme.colors.error
  },
  unreadButton: {
    width: 80,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: KittenTheme.colors.blueGray__2
  },
  swipeButtonText: {
    color: KittenTheme.colors.white,
    textAlign: 'center'
  }
});
