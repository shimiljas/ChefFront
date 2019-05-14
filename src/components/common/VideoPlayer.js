/*
 * @file: VideoPlayer.js
 * @description: Handle videos
 * @date: 31.07.2017
 * @author: Manish BUdhiraja
 * */

'use-strict';
import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
} from 'react-native';
import Constants from "../../constants";
import VideoPlayer from 'react-native-video-player';
import BackButton  from "./BackButton";

export default class Player extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { goBack } = this.props.navigation;
        return (
            <View style={{flex:1}}>
                <BackButton containerStyle={{marginTop:0,paddingTop:20,height:64,backgroundColor:"#000"}} onPress={()=>goBack()} />
                <View style={styles.mainView}>
                    <VideoPlayer
                        thumbnail={{uri:this.props.navigation.state.params.thumbnail}}
                        resizeMode={"contain"}
                        video={{uri:this.props.navigation.state.params.video}}
                        endWithThumbnail={true}
                        hideControlsOnStart={true}
                        disableControlsAutoHide={true}
                        autoplay={false}
                        disableFullscreen={true}
                        startInLoadingState= {true}
                        customStyles={{
                            video:styles.video,
                            videoWrapper:styles.videoView,
                            wrapper:styles.video,
                            thumbnail:styles.videoThumbnail,
                        }}
                />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex:1,
        backgroundColor:"#000",
        paddingTop:Constants.BaseStyle.DEVICE_HEIGHT / 100 * 18,
    },
    video: {
        height: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 40,
        width: Constants.BaseStyle.DEVICE_WIDTH
    },
    videoView: {
        marginTop: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 1,
        alignItems: "center",
    },
    videoThumbnail:{
        height: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 40,
        width: Constants.BaseStyle.DEVICE_WIDTH,
        marginTop: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 1,
    }
});
