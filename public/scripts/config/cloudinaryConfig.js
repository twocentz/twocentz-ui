(function() {
  'use strict';
  $.cloudinary.config().cloud_name = 'twocentz';
  $.cloudinary.config().upload_preset = 'uwkaxglj';
  angular
      .module('TwoCentzWeb')
      .config(function($httpProvider) {
          //Enable cross domain calls
          //$httpProvider.defaults.useXDomain = true;
          //$httpProvider.defaults.withCredentials = false;
      })
})()
