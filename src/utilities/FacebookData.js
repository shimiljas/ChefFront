/*
 * @file: FacebookData.js
 * @description: fetch facebook data for the application 
 * @date: 15.12.2016
 * @author: Manish Budhiraja
 * */

'use strict';

class FacebookData {

    static fetchFBData(credentials, imageSize, thumbSize) {
        return new Promise(function(fulfill, reject) {
            Promise.all([
                    FacebookData.fetchFBInfo(credentials),
                    FacebookData.fetchFBImage(credentials, imageSize),
                    FacebookData.fetchFBImage(credentials, thumbSize),
                    FacebookData.getFBFriends(credentials)
                ])
                .then((fbData) => {
                    fulfill(fbData);
                }, (err) => {
                    reject(err);
                });

        });
    };

    static fetchFBInfo(user) {
        var api = `https://graph.facebook.com/v2.9/${user.userId}?fields=first_name,last_name,name,email,gender,age_range,installed,link,timezone,verified,location,about,birthday,bio,relationship_status&access_token=${user.token}`;
        return new Promise(function(fulfill, reject) {
            fetch(api)
                .then((response) => response.json())
                .then((responseData) => {
                    fulfill(responseData);
                })
                .done();
        });
    };

    static fetchFBImage(user, FB_PHOTO_WIDTH) {
        var api = `https://graph.facebook.com/v2.9/${user.userId}/picture?width=${FB_PHOTO_WIDTH}&redirect=false&access_token=${user.token}`;
        return new Promise(function(fulfill, reject) {
            fetch(api)
                .then((response) => response.json())
                .then((responseData) => {           
                    fulfill({
                        url: responseData.data.url,
                        height: responseData.data.height,
                        width: responseData.data.width,
                    });

                })
                .done();
        });
    };

    static getFBFriends(user) {
        var api = `https://graph.facebook.com/v2.9/me/friends?access_token=${user.token}&limit=5000`;
        return new Promise(function(fulfill, reject) {
            fetch(api)
                .then((response) => response.json())
                .then((responseData) => {
                    fulfill(responseData);
                })
                .done();
        });
    };

}

module.exports = FacebookData;
