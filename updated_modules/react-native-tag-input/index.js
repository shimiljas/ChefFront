// @flow

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard
} from 'react-native';
import _ from 'lodash';

const { height, width } = Dimensions.get('window');

let prevLength = 0;
let prevAddOx = width;
let prevAddSpaceLeft = width;
let prevDeleteOx = width;
let prevDeleteSpaceLeft = width;

type Props = {
  /**
   * A handler to be called when array of tags change
   */
    onChange: (items: Array<any> ) => void,
  /**
   * An array of tags
   */
    value: Array<any>,
  /**
   * A RegExp to test tags after enter, space, or a comma is pressed
   */
    regex?: Object,
  /**
   * Background color of tags
   */
    tagColor?: string,
  /**
   * Text color of tags
   */
    tagTextColor?: string,
  /**
   * Color of text input
   */
    inputColor?: string,
  /**
   * TextInput props Text.propTypes
   */
    inputProps?: Object,
  /**
   * path of the label in tags objects
   */
    labelKey?: string,
  /**
   *  maximum number of lines of this component
   */
    numberOfLines: number,
};

type State = {
  text: string,
  inputWidth: ?number,
  lines: number,
};

type NativeEvent = {
  target: number,
  key: string,
  eventCount: number,
  text: string,
};

type Event = {
  nativeEvent: NativeEvent,
};

const DEFAULT_SEPARATORS = [',', ';', '\n'];
const DEFAULT_TAG_REGEX = /(.+)/gi;
const EMOJI_REGEX=/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g;
const ALPHANUMERIC=/^[a-z 0-9 ]+$/i;

class TagInput extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    regex: PropTypes.object,
    tagColor: PropTypes.string,
    tagTextColor: PropTypes.string,
    inputColor: PropTypes.string,
    inputProps: PropTypes.object,
    labelKey: PropTypes.string,
    numberOfLines: PropTypes.number,
  };

  props: Props;
  state: State = {
    text: '',
    inputWidth: null,
    lines: 2,
  };

  wrapperWidth = width;

  // scroll to bottom
  contentHeight: 0;
  scrollViewHeight: 0;

  static defaultProps = {
    tagColor: 'transparent',
    tagTextColor: '#ffffff',
    inputColor: '#ffffff',
    numberOfLines: 5,
  };

  constructor(props) {
    super(props);
    let context = this;
    setTimeout(()=>{
      if(context.props.value.length >= 9) {
        context.setState({ lines: 5 });
      } else if(context.props.value.length >= 6) {
        context.setState({ lines: 4 });
      } else  if(context.props.value.length >= 3) {
        this.setState({ lines: 3 });
      } else if(context.props.value.length <3) {
        this.setState({ lines: 2 });
      }
    },100);
  }

  componentDidMount() {
    setTimeout(() => {
      this.calculateWidth();
    }, 100);
  }

  componentDidUpdate(prevProps: Props, /*prevState*/) {
    if (prevProps.value.length != this.props.value.length) {
      this.calculateWidth();
    } else if(!prevProps.value){
      this.calculateWidth();
    }
  }

  measureWrapper = () => {
    if (!this.refs.wrapper)
      return;

    this.refs.wrapper.measure((ox, oy, w, /*h, px, py*/) => {
      this.wrapperWidth = w;
      this.setState({ inputWidth: this.wrapperWidth });
    });
  };

  calculateWidth = () => {
    let context = this;
    setTimeout(() => {
      if ((!this.refs['tag' + (this.props.value.length - 1)]) || (this.props.value.length == 1)) {
        this.setState({ lines: 2 });
        if(context.props.value.length == 0) {
          this.setState({ inputWidth: this.wrapperWidth });
        }

        if(context.props.value.length > 0) {
          context.refs['tag' + (context.props.value.length - 1)].measure((ox, oy, w, /*h, px, py*/) => {
            const endPosOfTag = w + ox;
            const margin = 3;
            const spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;
    
            const inputWidth = (spaceLeft < width/100*25) ? this.wrapperWidth : spaceLeft - 10;
            this.setState({ inputWidth });
          });
        }

        if(context.props.value.length == 1) {
          context.refs['tag' + (context.props.value.length - 1)].measure((ox, oy, w, /*h, px, py*/) => {
            const endPosOfTag = w + ox;
            const margin = 3;
            const spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;
    
            const inputWidth = (spaceLeft < width/100*25) ? this.wrapperWidth : spaceLeft - 10;
            const lines = 2;
            setTimeout(function() {
              context.setState({ inputWidth, lines });
            }, 100);
          });
        } else {
          this.setState({ lines: 2 });
        }

        return;
      }
      if(prevLength < this.props.value.length) {
        
        this.refs['tag' + (this.props.value.length - 1)].measure((ox, oy, w, /*h, px, py*/) => {
          const endPosOfTag = w + ox;
          const margin = 3;
          const spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;
  
          const inputWidth = (spaceLeft < width/100*25) ? this.wrapperWidth : spaceLeft - 10;

          if(this.state.lines >= this.props.numberOfLines) {
            this.setState({ inputWidth }, () => this.scrollToBottom());
          } else {
            if (spaceLeft < width/100*25) {
              if (this.state.lines < this.props.numberOfLines) {
                const lines = this.state.lines + 1;
                this.setState({ inputWidth, lines });
                
                if(spaceLeft >= width/100*25) {
                  const lines = this.state.lines - 1;
                  this.setState({ lines });              
                }
              } else {
                this.setState({ inputWidth }, () => this.scrollToBottom());
              }
            } else {
              if(prevAddSpaceLeft < w && this.state.lines < this.props.numberOfLines && ox == 0) {
                const lines = this.state.lines + 1;
                this.setState({ inputWidth, lines });
        
                if(spaceLeft >= width/100*25) {
                  const lines = this.state.lines - 1;
                  this.setState({ lines });
                }
              } else if(prevAddSpaceLeft < w && this.state.lines < this.props.numberOfLines) {
                this.setState({ inputWidth });
              } else {
                this.setState({ inputWidth });
              }
            }
          }
          prevAddSpaceLeft = spaceLeft;
        });
      } else if(prevLength > this.props.value.length) {

        context.refs['tag' + (context.props.value.length - 1)].measure((ox, oy, w, /*h, px, py*/) => {          
          const endPosOfTag = w + ox;
          const margin = 3;
          const spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;
  
          const inputWidth = (spaceLeft < width/100*25) ? this.wrapperWidth : spaceLeft - 10;
          if(prevDeleteOx == 0) {
            const lines = this.state.lines - 1;
            this.setState({ inputWidth, lines });  
          } else {
            this.setState({ inputWidth });
          }
          prevDeleteOx = ox;          
        });
      } else {
        this.setState({ lines: this.state.lines });
        context.refs['tag' + (context.props.value.length - 1)].measure((ox, oy, w, /*h, px, py*/) => {
          const endPosOfTag = w + ox;
          const margin = 3;
          const spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;
  
          const inputWidth = (spaceLeft < width/100*25) ? this.wrapperWidth : spaceLeft - 10;
          this.setState({ inputWidth });
        });
      }

      this.focus();
      
      prevLength = this.props.value.length;
    }, 100);
  };

  onChange = (event: Event) => {
    if (!event || !event.nativeEvent)
      return;

    const text = event.nativeEvent.text;
    this.setState({ text: text });
    const lastTyped = text.charAt(text.length - 1);

    const parseWhen = this.props.separators || DEFAULT_SEPARATORS;

    if (parseWhen.indexOf(lastTyped) > -1)
      this.parseTags();
  };

  onBlur = (event: Event) => {
    if(this.props.onBlur){
      this.props.onBlur();
    }
    if (!event || !event.nativeEvent || !this.props.parseOnBlur)
      return;
    const text = event.nativeEvent.text;
    this.setState({ text: text });
    this.parseTags();
  };

  onFocus = () => {
    if(this.props.onFocus){
      this.props.onFocus();
    }
  }

  parseTags = () => {
    let { text } = this.state;
    text=text.trim();
    const { value } = this.props;

    const regex = this.props.regex || DEFAULT_TAG_REGEX;
    const results = text.match(regex);
    
    if(text.match(ALPHANUMERIC)==null){
      this.setState({text: ''});
      Keyboard.dismiss();
      return ;
    }

    if (results && results.length > 0) {
      this.setState({text: ''});
      this.props.onChange([...new Set([...value, ...results])]);
    }
  };

  onKeyPress = (event: Event) => {
    if (this.state.text === '' && event.nativeEvent && event.nativeEvent.key == 'Backspace') {
      this.pop();
    }
  };

  focus = () => {
    if (this.refs.tagInput)
      this.refs.tagInput.focus();
  };

  pop = () => {
    const tags = _.clone(this.props.value);
    tags.pop();
    this.props.onChange(tags);
    this.focus();
  };

  removeIndex = (index: number) => {
    const tags = _.clone(this.props.value);
    tags.splice(index, 1);
    this.props.onChange(tags);
    this.focus();
  };

  _getLabelValue = (tag) => {
    const { labelKey } = this.props;

    if (labelKey) {
      if (labelKey in tag) {
        return tag[labelKey];
      }
    }

    return tag;
  };

  _renderTag = (tag, index) => {
    const { tagColor, tagTextColor } = this.props;

    return (
      <TouchableOpacity
        key={index}
        ref={'tag' + index}
        style={[styles.tag, { backgroundColor: tagColor }, this.props.tagContainerStyle]}
        onPress={() => this.removeIndex(index)}>
        <Text style={[styles.tagText, { color: tagTextColor, marginHorizontal:5 }, this.props.tagTextStyle]}>
          {this._getLabelValue(tag)}
        </Text>
      </TouchableOpacity>
    );
  };

  scrollToBottom = (animated: boolean = true) => {
    if (this.contentHeight > this.scrollViewHeight) {
      this.refs.scrollView.scrollTo({
        y: this.contentHeight - this.scrollViewHeight,
        animated,
      });
    }
  };

  render() {
    const { text, inputWidth, lines } = this.state;
    const { value, inputColor } = this.props;
    const defaultInputProps = {
      autoCapitalize: 'none',
      autoCorrect: false,
      placeholder: 'Enter here',
      placeholderTextColor: "#ffffff",
      returnKeyType: 'default',
      keyboardType: 'default',
      underlineColorAndroid: 'transparent',
      fontSize:(width/100)*2,
      fontFamily:'Montserrat-Regular',
    }

    const inputProps = {...defaultInputProps, ...this.props.inputProps};

    const wrapperHeight = (lines - 1) * 40 + 70;

    const width = inputWidth ? inputWidth : 400;

    return (
      <TouchableWithoutFeedback
        onPress={() => this.refs.tagInput.focus()}
        onLayout={this.measureWrapper}
        style={[styles.container]}>
        <View
          style={[styles.wrapper,{height: wrapperHeight}]}
          ref="wrapper"
          onLayout={this.measureWrapper}>
          <ScrollView
            ref='scrollView'
            style={styles.tagInputContainerScroll}
            onContentSizeChange={(w, h) => this.contentHeight = h}
            onLayout={ev => this.scrollViewHeight = ev.nativeEvent.layout.height}
          >
            <View style={styles.tagInputContainer}>
              {value.map((tag, index) => this._renderTag(tag, index))}
              <View style={[styles.textInputContainer, { width: this.state.inputWidth }]}>
                <TextInput
                  ref="tagInput"
                  blurOnSubmit={false}
                  onKeyPress={this.onKeyPress}
                  value={text}
                  style={[styles.textInput,
                    {
                      width: width,
                      color: inputColor,
                    }, this.props.textInput
                  ]}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  onChange={this.onChange}
                  onSubmitEditing={this.parseTags}
                  {...inputProps}
                  placeholder={this.props.placeholderText}
                  placeholderTextColor={this.props.placeholderTextColor}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 3,
    marginBottom: 2,
    alignItems: 'flex-start',
  },
  tagInputContainerScroll: {
    flex: 1,
  },
  tagInputContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textInput: {
    height: 36,
    fontSize: 16,
    flex: .6,
    marginBottom: 6,
    padding: 0,
  },
  textInputContainer: {
    height: 62,
  },
  tag: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginRight: 10,
    //padding: 15,
    height: 36,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#737373',
  },
  tagText: {
    padding: 0,
    margin: 0,
  },
});

export default TagInput;

export { DEFAULT_SEPARATORS, DEFAULT_TAG_REGEX }
