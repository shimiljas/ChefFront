/*
 * @file: i18n.js
 * @description: App i18n Localization
 * @date: 13.06.2017
 * @author: Manish Budhraja
 * */

'use strict';

let Strings = {
  common:{
    ok: "Ok",
    save: "Save",
    name: "Name",
    fullName: "Full Name",
    mobile: "Mobile No.",
    emailAddress: "Email Address",
    enterEmail: "Enter your email address.",
    enterValidEmail: "Enter valid email address.",
    emailOrMobile: "Email Address / Mobile No.",
    enterEmailOrMobile: "Enter your email address or mobile number.",
    enterValidEmailOrMobile: "Enter valid email address or mobile number.",
    password: "Password",
    enterPassword: "Enter your password.",
    enterValidPassword: "Password should be 6-16 characters long and must be alphanumeric and must not contain spaces.",
    fullAddress: "Full Address",
    favouriteFoods: "Favourite Foods",
    signup:"Sign Up",
    signin:"Sign In",
    contact:"Contact Support",
    write_us:"Write for us",
    contactNumber:"Enter mobile number.",
    settings:"Settings",
    changePassword:"Change Password",
    works:"How it works",
    about:"About",
    ratings:"Ratings",
    no_internet:"Please check your internet connectivity or our server is not responding.",
    firstName:"First Name",
    lastName:"Last Name",
    email:"Email"
  },
  signin:{
    forgotPassword: "Forgot Password?"
  },
  signup:{
    enterName: "Enter your name.",
    enterFullName: "Enter your full name.",
    enterValidFullName: "Full name must be 3-25 characters long.",
    enterMobile: "E.g. +11234567890",
    enterValidMobile: "Enter valid mobile number.",
    enterFullAddress: "Enter your full address.",
    enterFavouriteFoods: "Enter your favourite food.",

    experienceInYears: "Experience in years",
    enterExperienceInYears: "Enter experience in years.",
    enterValidExperienceInYears: "Enter valid experience in years.",

    description: "Describe yourself",
    enterDescription: "Enter description about yourself.",

    crimeConvicted: "Have you ever been convicted of a crime?",

    mealsSupported: "Meals supported",
    selectMealsSupported: "Select at least one supported meal.",

    enterMinimunMealSubcategory: "Enter atleast one meal subcategory.",

    workHistory: "Work history",
    workHistoryPlaceHolder: "maximum 3 images and 1 video",

    bankDetails: "Add you bank details ->",
    skip: "(You can also skip this step for now)",
    TnCText: "When you sign up, you automatically agree with our",
    TnCLink: "Terms of Service",

    enterMessage : "Enter your message.",
  },
  signupChef: {
    ratePerHour: "Rate per hour",
    enterRatePerHour: "Enter per hour rate.",
    enterValidRatePerHour: "Enter valid per hour rate.",

    milesWillingToTravel: "How many miles willing to travel?",
    enterMilesWillingToTravel: "Enter miles willing to travel.",
    enterValidMilesWillingToTravel: "Enter valid miles willing to travel.",

    typesOfDiet: "What types of diets they can cater to",
    selectTypesOfDiet: "Select at least one type of diet.",

    specializedCooking: "Types of cooking specialized in",
    enterSpecializedCooking: "Enter specialized cooking types.",

    minGuaranteedGuests: "Minimum guaranteed guest count",
    enterMinGuaranteedGuests: "Enter minimum guaranteed guest count.",
    enterValidMinGuaranteedGuests: "Enter valid minimum guaranteed guest count.",

    maxGuaranteedGuests: "Maximum guaranteed guest count",
    enterMaxGuaranteedGuests: "Enter maximum guaranteed guest count.",
    enterValidMaxGuaranteedGuests: "Enter valid maximum guaranteed guest count.",

    selectMeal: "Select atleast one meal."
  },
  signupCaterer: {
    enterPrice: "Enter Price",
    enterValidPrice: "Enter valid price",

    pastEvents: "Events you have done in past",
    enterPastEvents: "Enter atleast one event that you have done in past",
    enterHereWithComma: "Enter here with comma.",
    enterMealSubcategory: "Enter meal subcategory.",

    cateringType: "Catering Type",

    eventCatering: "Event catering",
    costPerPerson: "Cost per person",
    enterCostPerPerson: "Enter cost per person.",
    enterValidCostPerPerson: "Enter valid cost per person.",
    minGuestCount: "Min guest count",
    enterMinGuestCount: "Enter minimum guest count.",
    enterValidMinGuestCount: "Enter valid minimum guest count.",
    maxGuestCount: "Max guest count",
    enterMaxGuestCount: "Enter maximum guest count.",
    enterValidMaxGuestCount: "Enter valid maximum guest count.",

    dropOffCatering: "Drop off catering",
    deliveryFees: "Delivery fees",
    enterDeliveryFees: "Enter delivery fees.",
    enterValidDeliveryFees: "Enter valid delivery fees.",

    pickup: "Pickup",
    daysOpenOn: "Days open on",
    timeOpenOn: "Time open on",
    from: "From",
    to: "To",
    enterOpeningDay: "Enter opening day.",
    enterClosingDay: "Enter closing day.",

    selectAny: "Select atleast one of the three catering type.",
  },
  edit:{

  },
  password:{
    change:"Change Password",
    forgot:"Forgot Password",
    reset:"Reset Password",
    current:"Current Password",
    newPass:"New Password",
    confirm:"Confirm Password",
    currentPassword:"Please enter current password.",
    newPasskey:"Please enter new password.",
    confirmPasskey:"Please enter confirm password.",
    passwordMatched:"New password does not match the confirm password.",
    save:"Save",
    validatePassword:"Password should be 6-16 characters long and must be alphanumeric.",
    forgotInstructions:"Enter your mobile number below to receive OTP to reset your password."
  },
  chef_caterer_dashboard:{
    welcome     : "Welcome",
    request     : "Request",
    appointment : "Appointments",
    report      : "Reports",
    availability: "Availability",
    messages    : "Messages",
    profile     : "Profile"
  },
  reports:{
    report:"Report",
    appointment:"User's appointments",
    revenue:"Revenue",
    my_revenue:"My revenue",
    demand:"Service demand",
  },
  dispute:{
    title:"Raise dispute",
    name:"Your Name",
    email:"Your Email",
    contact:"Your Phone Number",
    msg:"Your Message"
  },
  about:{
    about:"About us",
    contact:"Contact support",
    policy:"Privacy Policy",
    service:"Terms of service",
    rights:"All rights reserved by ChefOrder",
    version:"Version",
  },
  bookings: {
    writeAReview : "Write a review",
    description : 'Description',
    enterDescription: "Enter description.",
    addtionalDescription: "Additional Description",
    price       : "Price",
    costDollar  : "Cost $",
    service     : "Service",
    reviews     : "Reviews",
    viewFullProfile: "View profile",
    time:'Time',
    bookingDescription:'Description of Request',
    enterBookingDescription:'Enter description of your booking.',
    otherDetails: "Other details",
    additionalDetails: "Additional details",
    preference: "Preference",
    addtionalCost: "Additional cost",
    addAddtionalCost: "Add addtional cost",
    totalCost: "Total cost",
    totalAmountPaid: "Total payable amount",
    hourlyRate: "Hourly Rate",
    timeDuration: "Time Duration",
    cookingStartTime: "Cooking start time",
    cookingEndTime: "Cooking end time",
    cookingDate: "Cooking date",
    cookingStartDate:  "Cooking start date",
    cookingEndDate:  "Cooking end date",
    addDescription: "Add description",
    raiseADispute: "Raise a dispute",
  },
  payments:{
    cardNumber: "Card Number",
    cardHolder: "Card Holder",
    expiry: "Expiry",
    cvv: "CVV",
    validCard: "All fields are mandatory.",
    firstNameNotEmpty: "First name should not be empty",
    enterValidFirstName: "Enter a valid first name",
    lastNameNotEmpty: "Last name should not be empty",
    enterValidLastName: "Enter a valid last name",
    enterValidCountryName: "Enter a valid country name",
    enterValidAccountNumber: "Enter a valid account number",
    enterValidRoutingNumber: "Enter a valid routing number",
    enterValidPostalCode: "Enter a valid postal code",
    enterValidCityName: "Enter a valid city name",
    enterValidStateName: "Enter a valid state name",
    enterValidSSN: "Enter a valid SSN number",
    onlyLastFourDigits: "Only last four digits",
  },
  profile: {
    addDetail: "Add detail",
    email: "Email",
    mobileNumber: "Mobile Number",
    anyCertifiedExpInCooking: "Any certified experience in cooking",
    whereTheSkillsAcquiredFrom: "Where the skills acquired from",
    whyYouLoveToCook: "Why you love to cook",
    doYouWorkOnHolidays: "Do you work on Holidays",
    facebookAddress: "Facebook Address",
    instagramAddress: "Instagram Address",
  },
  calendar: {
    months:['January', 'February', 'March', 'April', 'May','June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days:['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  explore: {
    earliestBookingAtleastTwoHoursFromNow: "You can make earliest booking for time atleast 2 hours from now.",
    endDateShouldBeAfterStartDate: "End date should be after start date.",
    hourlyDifferenceBetweenSelectedTimes: "There should be hourly difference between selected times.",
    enterValidTime: "Enter a valid time."
  }
}

module.exports = Strings;
