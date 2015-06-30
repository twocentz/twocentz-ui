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
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .state('topics', {
        url:'/topics/:slug',
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl'
      })
      .state('login', {
        url:'/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('add', {
        url:'/add',
        templateUrl: 'views/add.html',
        controller: 'AddCtrl',
        sp: {
          authenticate: true
        }
      })
      .state('signup', {
        url:'/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .state('verify', {
        url:'/emailVerification?sptoken',
        templateUrl: 'views/emailVerification.html',
        controller: 'VerifyCtrl'
      })

  })
 
  .run(function($stormpath){
    $stormpath.uiRouter({
      loginState: 'login',
      defaultPostLoginState: 'home'
    });
  });