/*
 * @file: routes.js
 * @description: For defining and importing all screens/routes
 * @date: 21.06.2017
 * @author: Manish Budhiraja
 * */

// Common
import Welcome from "../containers";
import Reports from "../containers/reports";
import ForgotPassword from "../containers/authentication/password/ForgotPassword";
import ChangePassword from "../containers/authentication/password/ChangePassword";
import ResetPassword from "../containers/authentication/password/ResetPassword";
import LoginSignup from "../containers/authentication";
import ContactSupport from "../containers/contact";
import Dispute from "../containers/dispute";
import About from "../containers/profile/about";
import Ratings from "../containers/profile/ratings";
import WebView from "../components/common/WebView";
import Location from "../components/common/Location";
import OTP from "../containers/authentication/Otp";
import Loader from "../components/common/Loader";
import RegisterCreditDebitCards  from "../containers/payments/RegisterCreditDebitCards";
import RegisterBank  from "../containers/payments/RegisterBank";
import VideoPlayer from "../components/common/VideoPlayer";
import Notifications from "../containers/notifications";
import Settings from "../containers/profile/Settings";
import RegisterBankDetails  from "../containers/payments/RegisterBankDetails";
import Messages from '../containers/messages';
import Chat from "../containers/messages/Chat";
import Availability from "../containers/availability";
import Bookings from "../containers/bookings";
import ViewRequest from '../containers/chef/ViewRequest'
import BookingRequestInfo from "../containers/bookings/BookingRequestDetails";
import PastBookingDetails from "../containers/bookings/PastBookingDetails";
import PastBookingDetailChef from "../containers/bookings/PastBookingDetailChef";
import ChefRequest from "../containers/chef/Requests";
import ReviewConsumerProfile from "../containers/chef/ReviewConsumerProfile";
import ChefAvailability from "../components/bookings/ChefAvailability";

// Consumer
import ConsumerSignup from "../containers/authentication/consumer/SignUp2";
import ConsumerDashboard from "../containers/consumer";
import ConsumerProfile from "../containers/profile/consumer/ViewProfile";
import ConsumerEditProfile from "../containers/profile/consumer/EditProfile";
import Booking from "../containers/consumer/explore/Booking";
import ViewBooking from "../containers/consumer/explore/ChefProfileOverview";
import Request from "../containers/consumer/explore/Request";
import ChefReviewProfile from "../containers/consumer/explore/ReviewProfile";

// Chef
import ChefSignUp from "../containers/authentication/chef/SignUp2";
import ChefSignUpStep3 from "../containers/authentication/chef/SignUp3";
import ChefSignUpStep4 from "../containers/authentication/chef/SignUp4";
import ChefDashboard from "../containers/chef";
import ChefProfile from "../containers/profile/chef";
import ChefViewProfile from "../containers/profile/chef/ViewProfile";
import ChefEditProfile from "../containers/profile/chef/EditProfile";

// Caterer
import CatererDashboard from "../containers/caterer";
import CatererSignUp from "../containers/authentication/caterer/SignUp2";
import CatererSignUpStep3 from "../containers/authentication/caterer/SignUp3";
import CatererSignUpStep4 from "../containers/authentication/caterer/SignUp4";


// common properties
const commonProps = {
};

// export list of routes.
export default routes = {

	// Common
	Loader							: { screen: Loader,  ...commonProps },
	Welcome							: { screen: Welcome,  ...commonProps },
	LoginSignup						: { screen: LoginSignup,  ...commonProps },
	ForgotPassword					: { screen: ForgotPassword,  ...commonProps },
	ChangePassword					: { screen: ChangePassword,  ...commonProps },
	ResetPassword					: { screen: ResetPassword,  ...commonProps },
	Reports 						: { screen: Reports,  ...commonProps },
	ContactSupport					: { screen: ContactSupport,  ...commonProps },
	Dispute 						: { screen: Dispute,  ...commonProps },
	About 							: { screen: About,  ...commonProps },
	Ratings 						: { screen: Ratings,  ...commonProps },
	WebView 						: { screen: WebView,  ...commonProps },
	Location 						: { screen: Location,  ...commonProps },
	OTP								: { screen: OTP,  ...commonProps },
	RegisterBank 					: { screen: RegisterBank, ...commonProps},
	VideoPlayer						: { screen: VideoPlayer, ...commonProps},
	Notifications 					: { screen: Notifications, ...commonProps},
	Settings						: { screen: Settings, ...commonProps},
	RegisterBankDetails 			: { screen: RegisterBankDetails, ...commonProps},
	Messages 						: { screen: Messages, ...commonProps},
	Chat							: { screen: Chat, ...commonProps},
	Availability 					: { screen: Availability, ...commonProps},
	ReviewConsumerProfile			: { screen: ReviewConsumerProfile, ...commonProps},
	ViewRequest						: { screen: ViewRequest, ...commonProps},

	// Consumer
	ConsumerDashboard 				: { screen: ConsumerDashboard,  ...commonProps },
	ConsumerSignup 					: { screen: ConsumerSignup,  ...commonProps },
	ConsumerProfile 				: { screen: ConsumerProfile,  ...commonProps },
	ConsumerEditProfile 			: { screen: ConsumerEditProfile,  ...commonProps },
	RegisterCreditDebitCards		: { screen: RegisterCreditDebitCards,  ...commonProps },

	// Chef
	ChefDashboard 					: { screen: ChefDashboard,  ...commonProps },
	ChefSignUp						: { screen: ChefSignUp,  ...commonProps },
	ChefSignUpStep3					: { screen: ChefSignUpStep3,  ...commonProps },
	ChefSignUpStep4					: { screen: ChefSignUpStep4,  ...commonProps },
	ChefProfile						: { screen: ChefProfile,  ...commonProps },
	ChefViewProfile					: { screen: ChefViewProfile,  ...commonProps },
	ChefEditProfile					: { screen: ChefEditProfile,  ...commonProps },
	ChefRequest				    	: { screen: ChefRequest,  ...commonProps },
	ChefAvailability				: { screen: ChefAvailability,  ...commonProps },

	// Caterer
	CatererDashboard 				: { screen: CatererDashboard,  ...commonProps },
	CatererSignUp 					: { screen: CatererSignUp,  ...commonProps },
	CatererSignUpStep3 				: { screen: CatererSignUpStep3,  ...commonProps },
	CatererSignUpStep4 				: { screen: CatererSignUpStep4,  ...commonProps },

	// Bookings
	Bookings						: { screen: Bookings,		...commonProps },
	ViewBooking						: { screen: ViewBooking,		...commonProps },
	BookingRequestInfo				: { screen: BookingRequestInfo,		...commonProps },
	Request							: { screen: Request,	...commonProps },
	PastBookingDetails				: { screen: PastBookingDetails,	...commonProps },
	PastBookingDetailChef			: { screen: PastBookingDetailChef,	...commonProps },
	Booking							: { screen: Booking,	...commonProps },
	ChefReviewProfile				: { screen: ChefReviewProfile,	...commonProps },
};
