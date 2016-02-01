
angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {

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
    $scope.request = function(){
      APP.request();
    }

  })


  .controller('SearchCtrl',function($scope){
    $scope.search_res = [];

    $scope.init = function () {
      console.log("ready to fetch");
      APP.search($scope, 1);
    };
    $scope.Request = function(itemId,itemName){
      APP.request(itemId,itemName);
    };
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
  .controller('RequestCtrl',function($scope){
    $scope.reqs=[];
    $scope.Refresh = function(){
      var list = APP.get("ListOfRequest");
      var query = new Parse.Query(Request);
      query.containedIn("objectId",list);
      query.find().then(function(results){
        $scope.reqs = results;
        $scope.$apply();
      });
    }
    $scope.Accept = function(requestObject,$index) {
      console.log("start accept");
      $scope.reqs.splice($index,1);
      APP.accept(requestObject.id, requestObject.get("itemId"), requestObject.get("requesterId"));
    }
  })

  .controller('RecordCtrl',function($scope){
    $scope.getItems=[];
    $scope.Refresh = function() {
      var list = APP.get("ListOfGet");
      var query = new Parse.Query(Item);
      query.containedIn("objectId", list);
      query.find().then(function (results) {
        $scope.getItems = results;
      });
    }
  })

  .controller('MainCtrl', function($scope, $ionicModal, $ionicActionSheet, $ionicPopup, $state, $cordovaCamera, $timeout) {

    $scope.newItem = {
      Title : "",
      Desc : ""
    };

    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
   // An alert dialog
     $scope.CreatePostAlert = function() {
       var alertPopup = $ionicPopup.alert({
         template: 'Post Success!'
       });
       alertPopup.then(function(res) {
         console.log('Thank you for not eating my delicious ice cream cone');
       });
     };
    $scope.createPost = function() {
      alert($scope.newItem.Title);
      if($scope.newItem.Title == "")
      {
        alert("no title");
        return;
      }
      var item = new Item();
      var GP = new Parse.GeoPoint.current({
        success: function (point){
          console.log("GP success");
        },
        error: function (error){
          console.log(error);
        }
      });
      item.set("Title", $scope.newItem.Title);
      item.set("ImageArry",photo_arry);
      item.set("Desc",$scope.newItem.Desc);
      item.set("Holder",currentUser.id);
      item.set("Owner", currentUser.get("username"));
      item.set("State", "Available");
      item.set("GeoPoint", GP);
      item.set("requestList", []);
      item.save(null, {
        success: function(item) {
          // Execute any logic that should take place after the object is saved.
          alert("Post Success");
          $scope.newItem.Title = null;
          $scope.newItem.Desc = null;
          $scope.modal.hide();
          APP.get("ListOfPostItem").push(item.id);
          APP.save();
        },
        error: function(item, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to create new object, with error code: ' + error.message);
        }
    });
  }

    $scope.showDetails = function() {
      photo_arry = [];
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
          isLogin = true;
          APP = currentUser.get("customer");
          APP.fetch().then(function(obj){
            if(APP.get("Requests").length != 0){
              AcceptTimer = setInterval(checkAccept,1000);
            }
            if(APP.get("ListOfPostItem").length!=0){
              RequestTimer = setInterval(checkRequest,3000);
            }
          });
          var GP = new Parse.GeoPoint.current({
            success: function (point){
             console.log("GP success");
            },
            error: function (error){
              alert(error);
            }
          });
          APP.set("CurrentGP", GP);
          APP.search($scope, 1);
          $state.go('tabs.home');
        },
        error: function(user, error) {
          alert(error);
          // The login failed. Check error to see why.
        }
      });
   }

  $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Request successfully',
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   }

   $scope.LogOut = function() {
    Parse.User.logIn();
    isLogin = false;
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
                        alert("photo success");
                        var file = new Parse.File("pic.www", imageData, "image/jpeg");
                        parseFile.save().then(function() {
                          alert("chengo");
                        }, function(error) {
                          alert(error);
                          // The file either could not be read, or could not be saved to Parse.
                        });
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
                        var file = new Parse.File("myfile.jpeg", fileData, "image/jpeg");
                        photo_arry.push(file);
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                }
   ;
  });



