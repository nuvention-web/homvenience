
angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})


.controller('SignInCtrl', function($scope, $state) {

    $scope.signIn = function(user) {
      console.log('Sign-In', user);
      $state.go('tabs.home');
    };

  })


.controller('HomeTabCtrl', function($scope) {
    console.log('HomeTabCtrl');
    $scope.search_res = []
    $scope.init = function () {
      console.log('ready to fetch');
      APP.search($scope, 1);
    }
    $scope.esc = function() {
      $state.go('detail');
    }
  })

//.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//  $scope.chat = Chats.get($stateParams.chatId);
//})
  


.controller('DetailCtrl',function($scope){
    $scope.search_res = []
    $scope.init = function () {
      console.log("ready to fetch");
      APP.search($scope, 1);
    }

  })


.controller('SearchCtrl',function($scope){
    $scope.search_res = []
    $scope.init = function () {
      console.log("ready to fetch");
      APP.search($scope, 1);
    }
  })

.controller('AccountCtrl', function($scope) {
    $scope.search_res = []
    $scope.init = function () {
      console.log("ready to fetch");
      APP.search($scope, 1);
    }
/*
    $scope.settings = {
    enableFriends: true
    };
*/


  })

  .controller('MainCtrl', function($scope, $ionicModal, $ionicActionSheet, $state, $cordovaCamera) {
    $scope.newPost = [
      { name: 'Gordon Freeman' },
      { name: 'Barney Calhoun' },
      { name: 'Lamarr the Headcrab' },
    ];
    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    
    $scope.createContact = function(u) {        
      APP.post(u.title, NULL, u.Desc, 'Ounan')
      $scope.modal.hide();
    };

    $scope.showDetails = function() {

     // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: 'Take a picture' },
         { text: 'Select from Photos' }
       ],
       cancelText: 'Cancel',
       cancel: function() {
            // add cancel code..
       },
       buttonClicked: function(index) {
        if(index == 0){
          $scope.takePhoto();
        }
        else if(index == 1){
          $scope.choosePhoto();
        }
         return true;
       }
     });
   }

    $scope.postShow = function() {

     // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: 'I can help' },
         { text: 'I need help' }
       ],
       cancelText: 'Cancel',
       cancel: function() {
            // add cancel code..
       },
       buttonClicked: function(index) {
        if(index == 0){
          $scope.modal.show();
        }
         return true;
       }
     });
   }


   $scope.SignIn = function(u) {
      Parse.User.logIn(u.username, u.password, {
        success: function(user) {
          currentUser = Parse.User.current();
          alert(currentUser.get("username"));
          console.log(currentUser.get("username"));
          isLogin = true;
          $state.go('tabs.home');
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
        }
      });
   }

  //bar上面的两种状态
   $scope.Header = function(){
    if(!isLogin)
      return "button button-clear icon ion-log-in";
    else
      return "button button-clear icon ion-log-out";
   }


   $scope.takePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                }
                
                $scope.choosePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                }
   ;
  })



