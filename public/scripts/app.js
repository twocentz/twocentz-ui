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
        controller: 'MainCtrl'
      })
      .state('shows', {
        url:'/shows/:id',
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
        controller: 'AddCtrl'
      })
      .state('signup', {
        url:'/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })

  })
 
  .run(function($stormpath){
    $stormpath.uiRouter({
      loginState: 'login',
      defaultPostLoginState: 'main'
    });
  });