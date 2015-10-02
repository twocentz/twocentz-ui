(function() {
  'use strict';

  angular.module('MyApp', [
    'ngCookies',
    'ngResource',
    'ngMessages',
    'ngAnimate',
    'ui.router',
    'mgcrea.ngStrap',
    'mgcrea.ngStrap.modal',
    'mgcrea.ngStrap.aside',
    'stormpath',
    'stormpath.templates',
    'angular-jqcloud'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
      $urlRouterProvider
        .otherwise('/');

      $locationProvider.html5Mode(true);

      $stateProvider
        .state('home', {
          url:'/',
          templateUrl: 'html/home.html',
          controller: 'HomeCtrl'
        })
        .state('movies', {
          url:'/movies/:slug',
          templateUrl: 'html/movies.html',
          controller: 'MovieCtrl'
        })
        .state('login', {
          url:'/login',
          templateUrl: 'html/login.html',
          controller: 'LoginCtrl'
        })
        .state('add', {
          url:'/add',
          templateUrl: 'html/add.html',
          controller: 'AddCtrl',
          sp: {
            authenticate: true
          }
        })
        .state('signup', {
          url:'/signup',
          templateUrl: 'html/signup.html',
          controller: 'SignupCtrl'
        })
        .state('profile', {
          url: '/profile',
          templateUrl: 'html/profile.html',
          controller: 'ProfileCtrl',
          sp: {
            authenticate: true
          }
        })
        .state('verify', {
          url:'/emailVerification?sptoken',
          templateUrl: 'html/emailVerification.html',
          controller: 'VerifyCtrl'
        })
        .state('passwordResetRequest', {
          url:'/password/requestReset',
          templateUrl: 'html/passwordResetRequest.html',
          controller: 'ResetCtrl'
        })
        .state('reset', {
          url:'/password/reset?sptoken',
          templateUrl: 'html/passwordReset.html',
          controller: 'ResetCtrl'
        });

    })
   
    .run(function($stormpath){
      $stormpath.uiRouter({
        loginState: 'login',
        defaultPostLoginState: 'home'
      });
    });
})();