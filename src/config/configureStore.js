/*
 * @file: configureStore.js
 * @description: configure redux store
 * @date: 21.06.2017
 * @author: Manish Budhiraja
 * */

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configureStore.dev');
} else {
  module.exports = require('./configureStore.prod');
}