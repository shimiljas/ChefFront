import Constants from '../../src/constants';
import { Platform } from 'react-native';

const NAV_BAR_HEIGHT = Platform.OS==='ios'?64:44;
const STATUS_BAR_HEIGHT =  Platform.OS==='ios'?20:0;

module.exports = {
  navBarContainer: {
    backgroundColor: '#2cba14',
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: '#2cba14',
  },
  customTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    alignItems: 'center',
  },
  navBarButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  navBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarButtonText: {
    fontSize: 17,
    letterSpacing: 0.5,
  },
  navBarTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:STATUS_BAR_HEIGHT
  },
  navBarTitleText: {
    letterSpacing: 0.5,
    color: '#fff',
    ...Constants.Fonts.nav_header,
  },
};
