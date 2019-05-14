import React, { PropTypes,Component } from "react";
import { View, Text,StyleSheet } from "react-native";
import Constants from "../../constants";
import TimerMixin from 'react-timer-mixin';
import ReactMixin from 'react-mixin'; 
import moment from 'moment';

class Timer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      startTime: props.startTime 
    }; 
  }

  componentDidMount() {  
    let self = this;
    let runTime = (new Date()).getTime();
    this.timer = this.setInterval(()=>{
      if(self.state.startTime-1 < 1){
        self.props.timeUp();
        self.clearInterval(this.timer);
        self.setState({startTime:0})
        return;
      }
      let duration = moment.duration(moment((new Date()).getTime(),'x').diff(moment(runTime,'x')));
      let mins = duration.asSeconds().toFixed(0);
      self.setState({startTime: self.props.startTime - mins});
    },1000);
  }

  componentWillUnmount () {
    this.clearInterval(this.timer);
  }

  render() {
    const { title,textLeft,textRight } = this.props
    let time = this.state.startTime;
    let minutes = Math.floor(time / 60);
    return (
      <View style={styles.container}>
        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
          <Text style={styles.time}>
            {('0' + minutes).slice(-2)}
          </Text> 
          <Text style={[styles.time,{marginLeft:5}]}>
            {":"}
          </Text> 
          <Text style={[styles.time,{marginLeft:5}]}>
            {('0' + (time - minutes * 60)).slice(-2)}
          </Text> 
        </View>
        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
          <Text style={[styles.subText,{marginLeft:-2}]}>Min</Text>
          <Text style={[styles.subText,{marginLeft:12}]}>Sec</Text>
        </View>
      </View>
    );
  }
}

const styles=StyleSheet.create({
  container:{
    borderWidth:1,
    alignSelf:"center", 
    borderColor:Constants.Colors.HeaderGreen,
    borderRadius:((Constants.BaseStyle.DEVICE_WIDTH/100)*15),
    width:(Constants.BaseStyle.DEVICE_WIDTH/100)*30,
    height:(Constants.BaseStyle.DEVICE_WIDTH/100)*30,
    alignItems:"center",
    justifyContent:"center"
  },
  time:{
    textAlign:"center",
    padding:0,
    backgroundColor:"transparent",
    margin:0,
    color:Constants.Colors.Black,
    ...Constants.Fonts.normal
  },
  subText: {
    textAlign:"center",
    padding:0,
    margin:0,
    backgroundColor:"transparent",
    color:Constants.Colors.Black,
    ...Constants.Fonts.smallSize
  }
})
Timer.PropTypes = {
   startTime: PropTypes.string.isRequired,
};

ReactMixin(Timer.prototype, TimerMixin);
export default Timer;