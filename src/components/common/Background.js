import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import Constants from "../../constants";

export default class Background extends Component {
  
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // Default Render Function
  render() {
    let { style , isFaded } = this.props;
    return ( 
      <Image 
        source={isFaded?Constants.Images.backgrounds.background_chef_caterer:Constants.Images.backgrounds.background_consumer} 
        style={[styles.container, this.props.style]}>
          {this.props.children}
      </Image>
    );
  }

}

const styles = StyleSheet.create({
  container:{
    flex  : 1,
    width : Constants.BaseStyle.DEVICE_WIDTH
  },
});

Background.propTypes = {
  style   : Image.propTypes.style,
  isFaded : PropTypes.bool
};
