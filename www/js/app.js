// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('forgotpassword', {
      url: '/forgot-password',
      templateUrl: 'templates/forgot-password.html'
    })
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    .state('tabs.neighbors', {
      url: '/neighbors',
      views: {
        'neighbors-tab': {
          templateUrl: 'templates/neighbors.html',
          controller: 'NeighborsTabCtrl'
        }
      }
    })

    .state('tabs.home', {
      url: '/home',
      views: {
        'home-tab': {
          templateUrl: 'templates/home.html',
          controller: 'HomeTabCtrl'
        }
      }
    })

    .state('detail', {
      url: '/detail/:itemObj',
      templateUrl: 'templates/detail.html',
      controller: 'DetailCtrl'
    })

    .state('user-profile', {
      url: '/user-profile/:user',
      templateUrl: 'templates/user-profile.html',
      controller:'ProfileCtrl'
    })

    .state('tabs.search',{
      url: '/search',
      cache:false,
      views:{
        'search-tab':{
          templateUrl: 'templates/search.html',
          controller:'SearchCtrl'
        }
      }
    })

    .state('tabs.chat',{
      url: '/chat',
      cache:false,
      views:{
        'chat-tab':{
          templateUrl: 'templates/chat.html',
          controller:'ChatCtrl'
        }
      }
    })

    .state('chatdetail',{
      url: '/chatDetail/:username',
      templateUrl: 'templates/chatDetails.html',
      controller:'ChatDetailCtrl'
    })

    .state('request', {
      url: '/request',
      controller: 'RequestCtrl',
      templateUrl: 'templates/request.html',
    })

    .state('offering', {
      url: '/offering',
      controller:'OfferingCtrl',
      templateUrl: 'templates/offering.html',
    })

    .state('record', {
      url: '/record',
      controller: 'RecordCtrl',
      templateUrl: 'templates/record.html',
    })

    .state('tabs.account', {
      url: '/account',
      views: {
        'account-tab': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })


    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html"
    });
    // .state("tabs.post", {
    //   url: '/post',
    //   views:{
    //     'post-tab':{
    //       templateUrl: 'templates/home.html',
    //       controller: 'HomeTabCtrl'
    //     }
    //   }
    // });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/sign-in');

});
