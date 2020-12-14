import React from 'react';

import { tw } from 'react-native-tailwindcss';

import { View, TouchableOpacity } from 'react-native';

import { RkText } from 'react-native-ui-kitten';
import { Ionicons } from '@expo/vector-icons';

export default class Widget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: props.expanded,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.expanded !== nextProps.expanded) {
      this.setState({ expanded: nextProps.expanded });
    }
  }

  onToggle = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
  };

  render() {
    return (
      <View style={[]}>
        <TouchableOpacity style={[tw.flexRow]} onPress={this.onToggle}>
          <RkText rkType="bold" style={tw.flex1}>
            {this.props.question}
          </RkText>
          <View style={[tw.pT1, tw.pX2]}>
            <Ionicons
              name={this.state.expanded ? 'ios-arrow-up' : 'ios-arrow-down'}
              size={18}
            />
          </View>
        </TouchableOpacity>
        {this.state.expanded && (
          <RkText style={tw.pT1}>{this.props.answer}</RkText>
        )}
      </View>
    );
  }
}
