import { Linking, Platform } from 'react-native';

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as IntentLauncher from 'expo-intent-launcher';

let deviceToken = '';

/**
 * Get device push token
 */
export function getDeviceToken() {
  return deviceToken;
}

/**
 * Open Notification settings
 */
export function openSettings() {
  // On Android
  if (Platform.OS === 'android') {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ACTION_APP_NOTIFICATION_SETTINGS,
      {
        extra: {
          'android.provider.extra.APP_PACKAGE':
            Constants.appOwnership === 'expo'
              ? 'host.exp.exponent'
              : Constants.manifest.android.package,
        },
      },
    );
  }

  // On iOS
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  }
}

/**
 * Create a Notification channel on Android 8.0+
 */
export function createChannel() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('notification', {
      name: 'Thông báo',
      showBadge: true,
      vibrationPattern: [0, 250, 250, 250],
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}

/**
 * Set number displayed in app icon's badge
 */
export async function setBadgeNumber(number) {
  if (Platform.OS === 'ios') {
    Notifications.setBadgeCountAsync(number);
  }
}

/**
 * Register to receive Push Notifications
 */
export async function registerPushNotify() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS,
  );
  let finalStatus = existingStatus;

  // Only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return '';
  }

  // Get the token that uniquely identifies this device
  if (Constants.isDevice) {
    const expoPushToken = await Notifications.getExpoPushTokenAsync();
    deviceToken = expoPushToken.data;
  }

  return deviceToken;
}
