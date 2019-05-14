import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Dimensions
} from 'react-native';

let Screen = Dimensions.get("window");
import { ToastActionsCreators } from 'react-native-redux-toast';
import { getSocketClient } from '../../../src/utilities/SocketClient';

export default class Send extends React.Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.text.trim().length === 0 && nextProps.text.trim().length > 0 || this.props.text.trim().length > 0 && nextProps.text.trim().length === 0) {
  //     return true;
  //   }
  //   return false;
  // }
  render() {
    // if (this.props.text.trim().length > 0) {
      return (
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
            if(!getSocketClient().connected){
              this.props.navigation.dispatch(ToastActionsCreators.displayInfo('Please check your internet connectivity or our server is not responding.'));
              return;
            }
            this.props.onSend({text: this.props.text.trim()}, true);
          }}
          accessibilityTraits="button"
        >
          <Text style={[styles.text, this.props.textStyle]}>{this.props.label}</Text>
        </TouchableOpacity>
      );
    // }
    // return <View/>;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  text: {
    color: '#212123',
    fontWeight: '600',
    fontSize: (Screen.width/100)*3.5,
    fontFamily: 'Montserrat-Regular',
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginRight: 10,
  },
});

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: 'Send',
  containerStyle: {},
  textStyle: {},
};

Send.propTypes = {
  text: PropTypes.string,
  onSend: PropTypes.func,
  label: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
};
