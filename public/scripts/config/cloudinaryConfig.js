(function() {
  'use strict';
  $.cloudinary.config().cloud_name = 'twocentz';
  $.cloudinary.config().upload_preset = 'uwkaxglj';
  angular
      .module('TwoCentzWeb')
      .config(function($httpProvider) {
        $httpProvider.interceptors.push(function() {
          return {
            request: function(config) {
              // overwrites stormpath interceptor which blocks CORS requests
              config.withCredentials=false;
              return config;
            }
          };
        });
      })
})()
