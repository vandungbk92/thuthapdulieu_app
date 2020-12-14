import React from 'react';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

const AppNavigator = createSwitchNavigator({
  Main: MainTabNavigator,
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
