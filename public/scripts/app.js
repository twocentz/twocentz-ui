'use strict';

angular.module('MyApp', [
  'ngCookies',
  'ngResource',
  'ngMessages',
  'ngAnimate',
  'ui.router',
  'mgcrea.ngStrap',
  'stormpath',
  'stormpath.templates'
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
      .state('topics', {
        url:'/topics/:slug',
        templateUrl: 'html/detail.html',
        controller: 'DetailCtrl'
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