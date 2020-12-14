import React from 'react';
import {
  View,
  Animated,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';

import getIn from 'lodash/get';
import moment from 'moment';
import { connect } from 'react-redux';

import { RkText } from 'react-native-ui-kitten';
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons';

import { SwipeRow } from 'react-native-swipe-list-view';
import { UltimateListView } from 'react-native-ultimate-listview';

import I18n from '../../utilities/I18n';

import { API, COMMON_APP, CONSTANTS } from '../../constants';
import { REQUEST_DETAIL_PAGE } from '../../constants/router';

import { KittenTheme } from '../../../config/theme';
import { styleContainer } from '../../stylesContainer';

import Socket from '../../utilities/Socket';
import * as PushNotify from '../../utilities/PushNotify';

import { getNotifications } from '../../epics-reducers/services/notificationServices';
import { addMoreNotificationsSuccess } from '../../epics-reducers/fetch/fetch-notifications.duck';

import styles from './styles';

export class Notifications extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    const notifyCount = getIn(params, ['notification', 'count'], 0);

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
          {I18n.t('notifications')}
        </RkText>
      ),
      headerRight: () => (
        <React.Fragment>
          <TouchableOpacity
            style={[styleContainer.headerButton, styles.headerButton]}
            onPress={() => params && params.onCheckAll()}
            disabled={notifyCount <= 0}
          >
            <MaterialCommunityIcons
              name="check-all"
              size={20}
              color={
                notifyCount > 0
                  ? KittenTheme.colors.appColor
                  : KittenTheme.colors.blueGray_2
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styleContainer.headerButton, styles.headerButton]}
            onPress={() => PushNotify.openSettings()}
          >
            <Ionicons
              name="ios-settings"
              size={20}
              color={KittenTheme.colors.appColor}
            />
          </TouchableOpacity>
        </React.Fragment>
      )
    };
  };

  state = {
    isLoadmore: false
  };

  listView = null;

  swipeRows = {};

  paginationStatus = 1;

  animatedSwipeRows = {};

  componentWillMount() {
    this.props.navigation.setParams({
      onCheckAll: this.onCheckAll,
      notification: this.props.notification
    });
  }

  componentDidMount() {
    this.listView.updateRows(
      this.props.notification.data,
      this.paginationStatus
    );
    this.props.notification.data.forEach(item => {
      this.animatedSwipeRows[item._id] = new Animated.Value(0);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.notification.data !== nextProps.notification.data) {
      this.listView.updateRows(
        nextProps.notification.data,
        this.paginationStatus
      );
      nextProps.notification.data.forEach(item => {
        this.animatedSwipeRows[item._id] = new Animated.Value(0);
      });
    }

    if (this.props.notification.count !== nextProps.notification.count) {
      this.props.navigation.setParams({
        notification: nextProps.notification
      });
    }
  }

  sleep(timeout) {
    return new Promise(resolve => setTimeout(() => resolve(), timeout));
  }

  getTimeFromNow(time) {
    const date = moment(time).format('YYYY-MM-DD');
    const lastWeek = moment(new Date()).subtract(7, 'day').format('YYYY-MM-DD');

    if (date > lastWeek) {
      return moment(time).fromNow();
    } else {
      return moment(time).format('D MMMM');
    }
  }

  getLastCreateAt() {
    const { data } = this.props.notification;
    if (data && data[data.length - 1]) {
      const { created_at } = data[data.length - 1];
      return created_at;
    }
    return '';
  }

  setScrollEnabled = enable => {
    if (this.listView && this.listView._flatList.setNativeProps) {
      this.listView._flatList.setNativeProps({ scrollEnabled: enable });
    }
  };

  onFetch = (page = 1) => {
    if (page <= 1) {
      return;
    }

    if (this.state.isLoadmore) {
      return;
    }

    this.onGetNotifications();
  };

  onPress = item => {
    this.onReadPress(item);
    this.props.navigation.navigate(REQUEST_DETAIL_PAGE, {
      id: item.request_id,
      type: CONSTANTS.MY_REQUESTS,
      onGoBack: () => {}
    });
  };

  onCheckAll = () => {
    if (Socket.connected) {
      const payload = {
        citizen_id: this.props.tokenDecode.id
      };
      Socket.emit('citizen_all_notify_yn', payload);
    }
  };

  onReadPress = (item, viewYn = true) => {
    if (Socket.connected) {
      const payload = {
        _id: item._id,
        viewYn,
        citizen_id: this.props.tokenDecode.id
      };
      Socket.emit('citizen_read_notify_yn', payload);
    }
  };

  onRemovePress = item => {
    if (Socket.connected) {
      const payload = {
        _id: item._id,
        citizen_id: this.props.tokenDecode.id
      };
      Socket.emit('citizen_delete_notify', payload);
    }
  };

  onSwipeValueChange = (item, { value }) => {
    this.animatedSwipeRows[item._id].setValue(Math.abs(value));
  };

  onGetNotifications = async () => {
    try {
      this.setState({ isLoadmore: true });

      await this.sleep(1000);

      const createdAt = this.getLastCreateAt();
      const responseData = await getNotifications(createdAt);

      if (responseData.docs && responseData.docs.length > 0) {
        this.props.dispatch(addMoreNotificationsSuccess(responseData.docs));
      } else {
        this.paginationStatus = 2;
        this.listView.updateRows(null, this.paginationStatus);
      }

      this.setState({ isLoadmore: false });
    } catch (error) {
      this.setState({ isLoadmore: false });
    }
  };

  renderItem = (item, index) => {
    return (
      <SwipeRow
        ref={ref => (this.swipeRows[item._id] = ref)}
        rightOpenValue={-160}
        stopRightSwipe={-160}
        disableRightSwipe
        setScrollEnabled={this.setScrollEnabled}
        onSwipeValueChange={swipeValue =>
          this.onSwipeValueChange(item, swipeValue)}
      >
        <View style={styles.backSwipeRow}>
          <TouchableOpacity
            style={styles.unreadButton}
            onPress={() => {
              this.onReadPress(item, !item.viewYn);
              this.swipeRows[item._id].closeRow();
            }}
          >
            <RkText style={styles.swipeButtonText} rkType="small">
              {item.viewYn ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
            </RkText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              this.onRemovePress(item);
              this.swipeRows[item._id].closeRow();
            }}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    scale: this.animatedSwipeRows[item._id].interpolate({
                      inputRange: [0, 120],
                      outputRange: [0, 1],
                      extrapolate: 'clamp'
                    })
                  }
                ]
              }}
            >
              <FontAwesome
                name="trash-o"
                size={20}
                color={KittenTheme.colors.white}
              />
            </Animated.View>
            <RkText style={styles.swipeButtonText} rkType="small">
              Xóa
            </RkText>
          </TouchableOpacity>
        </View>
        <TouchableHighlight
          style={{
            minHeight: 50,
            backgroundColor: item.viewYn
              ? KittenTheme.colors.white
              : KittenTheme.colors.active
          }}
          onPress={() => this.onPress(item)}
          underlayColor={KittenTheme.colors.border}
        >
          <View style={styles.frontSwipeRow}>
            <View style={styles.mr10}>
              <Image
                style={styles.notifyImage}
                source={
                  item.image
                    ? {
                        uri: COMMON_APP.HOST_API + API.IMAGES.format(item.image)
                      }
                    : require('../../../assets/images/no_notification.png')
                }
              />
            </View>
            <View style={styles.notifyContent}>
              <RkText>
                <RkText rkType="header6" numberOfLines={1}>
                  {item.create_by && item.create_by.unit_id
                    ? item.create_by.unit_id.name
                    : ''}
                </RkText>
                <RkText>{` ${item.content}`}</RkText>
              </RkText>
              <RkText
                color={KittenTheme.colors.blueGray__1}
                rkType="subtitle secondary5"
              >
                {this.getTimeFromNow(item.created_at)}
              </RkText>
            </View>
          </View>
        </TouchableHighlight>
      </SwipeRow>
    );
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  renderEmptyView = () => {
    return (
      <View style={styles.listView}>
        <View style={styles.emptyView}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.circle3} />
          <View style={styles.circle4} />
          <View style={styles.circleWrapper}>
            <View style={styles.circle}>
              <Ionicons
                name="md-notifications"
                size={36}
                color={KittenTheme.colors.warning}
              />
            </View>
          </View>
        </View>
        <RkText style={styles.mt5}>Chưa có thông báo nào</RkText>
      </View>
    );
  };

  renderWaitingView = () => {
    if (this.state.isLoadmore) {
      return (
        <View style={styles.waitingView}>
          {/*<ActivityIndicator color={KittenTheme.colors.warning} size="small" />*/}
          <RkText style={styles.ml5}>Đang tải thêm thông báo</RkText>
        </View>
      );
    }
    return null;
  };

  renderFetchingView = () => {
    return (
      <View style={styles.listView}>
        {/*<ActivityIndicator color={KittenTheme.colors.appColor} size="large" />*/}
        <RkText style={styles.mt5}>Đang tải danh sách thông báo</RkText>
      </View>
    );
  };

  renderAllLoadedView = () => {
    return (
      <View style={styles.waitingView}>
        <RkText>Không có thêm thông báo nào khác</RkText>
      </View>
    );
  };

  render() {
    return (
      <View style={styleContainer.containerContent}>
        <UltimateListView
          ref={ref => (this.listView = ref)}
          item={this.renderItem}
          onFetch={this.onFetch}
          keyExtractor={(item, index) => item._id}
          refreshable={false}
          refreshableColors={[KittenTheme.colors.appColor]}
          refreshableTintColor={KittenTheme.colors.appColor}
          separator={this.renderSeparator}
          emptyView={this.renderEmptyView}
          paginationWaitingView={this.renderWaitingView}
          paginationFetchingView={this.renderFetchingView}
          paginationAllLoadedView={this.renderAllLoadedView}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  tokenDecode: state.tokenDecode,
  notification: state.notification
});

export default connect(mapStateToProps)(Notifications);
