(function() {
  'use strict';

  angular.module('TwoCentzWeb', [
    'tcFocus',
    'algoliasearch',
    'ngCookies',
    'ngResource',
    'ngMessages',
    'ngAnimate',
    'toastr',
    'ui.router',
    'ngSanitize',
    'mgcrea.ngStrap',
    'mgcrea.ngStrap.modal',
    'mgcrea.ngStrap.aside',
    'stormpath',
    'stormpath.templates',
    'angular-jqcloud',
    'LocalStorageModule',
    'formly',
    'formlyBootstrap',
    'ngFileUpload',
    'cloudinary',
    'masonry',
    'ng-mfb',
    'cgBusy'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {


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
        .state('usertopic', {
          url: '/user/:username/:slug',
          templateUrl: 'html/userTopic.html',
          controller: 'UserTopicCtrl'
        })
        .state('login', {
          url:'/login',
          external: true
        })
        .state('add', {
          url:'/add',
          templateUrl: 'html/add.html',
          controller: 'AddCtrl',
          sp: {
            authenticate: true
          }
        })
        .state('mytopics', {
          url:'/mytopics',
          templateUrl: 'html/mytopics.html',
          controller: 'MyTopicsCtrl',
          sp: {
            authenticate: true
          }
        })
        .state('signup', {
          url: '/signup',
          external: true
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
          url:'/password/requestReset?sptoken',
          templateUrl: 'html/passwordResetRequest.html',
          controller: 'ResetCtrl'
        })
        .state('reset', {
          url:'/password/reset?sptoken',
          templateUrl: 'html/passwordReset.html',
          controller: 'ResetCtrl'
        });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

    })

    .run(function($stormpath){
      $stormpath.uiRouter({
        loginState: 'login',
        defaultPostLoginState: 'home'
      });
    })

    .run(function($rootScope, $window) {
      $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
          if (toState.external) {
            event.preventDefault();
            $window.open(toState.url, '_self');
          }
        });
    });
})();
