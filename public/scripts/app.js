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
        .state('login', {
          url:'/login',
          external: true
        })
        .state('logout', {
          url:'/logout',
          controller: 'LogoutCtrl'
        })
        .state('home', {
          url:'/',
          templateUrl: 'html/home.html',
          controller: 'HomeCtrl',
          reloadOnSearch : false,
          sp: {
            waitForUser: true
          }
        })
        .state('movies', {
          url:'/movies/:slug',
          templateUrl: 'html/movies.html',
          controller: 'MovieCtrl',
          sp: {
            waitForUser: true
          }
        })
        .state('usertopic', {
          url: '/user/:username/:slug',
          templateUrl: 'html/userTopic.html',
          controller: 'UserTopicCtrl',
          sp: {
            waitForUser: true
          }
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
        .state('profile', {
          url: '/profile',
          templateUrl: 'html/profile.html',
          controller: 'ProfileCtrl',
          sp: {
            authenticate: true
          }
        })
        .state('admincreate', {
          url: '/admin/create',
          templateUrl: 'html/adminCreate.html',
          controller: 'AdminCreateCtrl',
          sp: {
            authorize: {
              group: 'admins'
            }
          }
        });

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

    })

    .run(function($stormpath){
      $stormpath.uiRouter({
        loginState: 'login',
        forbiddenState: 'home',
        defaultPostLoginState: 'home'
      });
    })

    .run(function($rootScope, $window, $state) {
      $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
          if (toState.external) {
            event.preventDefault();
            $window.open(toState.url, '_self');
          }
        });

      $rootScope.$on('$sessionEnd',function () {
        $state.transitionTo('home');
      });
    });
})();
