Object.defineProperty(exports,"__esModule",{value:true});var _reactNative=require('react-native');

var colors={
black:'rgba(0,0,0,1)',
liteBlack: 'rgba(0,0,0,0.7)',
blue:'#40C4FE',
red:'#F55E64',
transparent:'transparent',
yellow:'#FFD200'};exports.default=


_reactNative.StyleSheet.create({
container:{
backgroundColor:colors.transparent,
bottom:100,
zIndex:100,
position:'absolute',
left:0,
right:0,
justifyContent:'center',
alignItems:'center'},

messageContainer:{
backgroundColor:colors.black,
borderRadius:20,
marginHorizontal:20,
overflow:'hidden',
paddingVertical:5,
paddingHorizontal:15},

error:{
backgroundColor:colors.red},

warning:{
backgroundColor:colors.yellow},

shadow:{
elevation:10,
shadowColor:colors.liteBlack,
shadowOpacity:0.5,
shadowOffset:{
height:0,
width:0},

shadowRadius:5}});