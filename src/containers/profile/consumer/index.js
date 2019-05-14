import React, { Component } from "react";
import {
  ListView,
  ScrollView,
  VirtualizedList,
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  RefreshControl,
  Platform
} from "react-native"; 
import Constants from "../../../constants";
import Avatar from "../../../components/common/Avatar";
import StarRating from "../../../components/common/StarRating";
import NavigationBar from "react-native-navbar";
import TextField from "../../../components/common/TextField";
import ComingSoon from "../../../components/common/ComingSoon";
import _ from "lodash";
import ReactMixin from "react-mixin";
import TimerMixin from "react-timer-mixin";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../../../redux/modules/user";
import Idx from "../../../utilities/Idx";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    let {
      settings,
      changePassword,
      works,
      about,
      ratings
    } = Constants.i18n.common;
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      data = [changePassword, works, about, ratings];
    let token = "",
      userId = "";
    this.isLoggedIn = false;

    if (Idx(this.props, _ => _.user.userDetails.auth.token)) {
      this.isLoggedIn = true;
      token = this.props.user.userDetails.auth.token;
      userId = this.props.user.userDetails.userId;
    }

    this.state = {
      dataSource: data,
      token: token,
      userId: userId,
      refreshing : false
    };
    this.logout = this.logout.bind(this);
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) =>
      <Image
        source={Constants.Images.user.bottom_profile_active}
        style={[styles.icon, { tintColor: tintColor }]}
      />
  };
  /**
  * Call logout
  */
  logout() {
    let context = this;
    context.props.userActions.logout(this.state);
  }

  /**
  * Get User Details 
  */
  getUserDetails=()=>{
    let context = this;
    context.props.userActions.getUserDetails(this.state);
  }

  onRowPress(title) {
    let context = this;
    let {
      settings,
      changePassword,
      works,
      about,
      ratings
    } = Constants.i18n.common;
    let { navigate } = this.props.navigation;

    switch (title) {
      case changePassword:
        navigate("ChangePassword");
        break;
      case works:
        navigate("WebView", { title: works, url:"howItWorks" });
        break;
      case about:
        navigate("About");
        break;
      case ratings:
        navigate("Ratings");
        break;
    }
  }

  /**
  * Render ListView Components
  */
  _renderRow(rowData: string, index: number) {
    let context = this;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => context.onRowPress(rowData)}
        underlayColor={Constants.Colors.Transparent}
        style={styles.rowContainer}
      >
        <Text style={[styles.rowTitle]}>
          {rowData}
        </Text>
        <Image
          style={styles.arrow}
          source={Constants.Images.caterer.arrow_green}
        />
      </TouchableOpacity>
    );
  }

  render() {
    let context = this;
    let { navigate, dispatch } = this.props.navigation;
    let {
      email,
      mobile,
      fullAddress,
      favouriteFoods,
      addDetails
    } = Constants.i18n.common;

    const titleConfig = {
      title: "Profile",
      tintColor: "#fff",
      style: {
        ...Constants.Fonts.content
      }
    };
    
    return (
      <View style={styles.container}>
        <NavigationBar title={titleConfig} />
        {!this.isLoggedIn &&
          <ComingSoon
            info={"Please Sign in."}
            onPress={() => navigate("LoginSignup", { userType: "customer",initialIndex:1 })}
          />
        }
        {this.isLoggedIn &&
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
            <View style={styles.header}>
              <View style={styles.profile}>
                <Avatar
                  user={this.props.user.userDetails}
                  placeholderStyle={styles.placeholderStyle}
                  avatarStyle={styles.avatarStyle}
                />
              </View>
              <View style={styles.details}>
                <View
                  style={{ height: Constants.BaseStyle.DEVICE_WIDTH / 100 * 16 }}
                >
                  <Text numberOfLines={1} style={styles.name}>
                    {this.props.user.userDetails.fullName.capitalizeEachLetter()}
                  </Text>
                  <Text numberOfLines={2} style={styles.email_address}>
                    {this.props.user.userDetails.email.toLowerCase()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={this.getUserDetails}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <Text style={styles.view_profile}>
                    {"View profile"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {_.map(context.state.dataSource, function(data, index) {
              return context._renderRow(data, index);
            })}
            <TouchableOpacity
              onPress={this.logout}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              style={styles.logout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Colors.White
  },
  icon: {
    width: 26,
    height: 26
  },
  header: {
    margin: Constants.BaseStyle.DEVICE_WIDTH * 5 / 100,
    flexDirection: "row",
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH * 5 / 100,
    paddingBottom: Constants.BaseStyle.DEVICE_HEIGHT * 2 / 100,
    borderBottomColor: Constants.Colors.GhostWhite,
    borderBottomWidth: 1
  },
  profile: {
    flex: 3,
    flexDirection: "column"
  },
  name: {
    ...Constants.Fonts.contentBold,
    color: Constants.Colors.Black,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT * 0.5 / 100
  },
  email_address: {
    ...Constants.Fonts.tinyLarge,
    color: Constants.Colors.Gray,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT * 0.5 / 100
  },
  view_profile: {
    ...Constants.Fonts.content,
    color: Constants.Colors.Green,
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT * 1.6 / 100
  },
  details: {
    flex: 6
  },
  placeholderStyle: {
    width: Constants.BaseStyle.DEVICE_WIDTH / 100 * 22,
    height: Constants.BaseStyle.DEVICE_WIDTH / 100 * 22,
    borderRadius: null
  },
  avatarStyle: {
    width: Constants.BaseStyle.DEVICE_WIDTH / 100 * 24,
    height: Constants.BaseStyle.DEVICE_WIDTH / 100 * 24,
    borderRadius: null
  },
  rowContainer: {
    height: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 11,
    borderBottomWidth: 1,
    borderBottomColor: Constants.Colors.GhostWhite,
    justifyContent: "center",
    marginHorizontal: Constants.BaseStyle.DEVICE_WIDTH * 5 / 100
  },
  arrow: {
    height: Constants.BaseStyle.DEVICE_WIDTH / 100 * 6,
    width: Constants.BaseStyle.DEVICE_WIDTH / 100 * 3,
    position: "absolute",
    right: Constants.BaseStyle.DEVICE_WIDTH * 2 / 100
  },
  rowTitle: {
    ...Constants.Fonts.normal,
    color: Constants.Colors.Green
  },
  logout: {
    height: Constants.BaseStyle.DEVICE_HEIGHT / 100 * 3.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Constants.BaseStyle.DEVICE_HEIGHT/100*5,
    marginBottom: Platform.OS==='ios' ? 0 : Constants.BaseStyle.DEVICE_HEIGHT*5/100,
    width: Constants.BaseStyle.DEVICE_WIDTH / 100 * 25,
    alignSelf: "center",
  },
  logoutText: {
    color: Constants.Colors.Magenta,
    ...Constants.Fonts.normal
  }
});

ReactMixin(Profile.prototype, TimerMixin);

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
