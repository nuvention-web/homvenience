
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
      APP.search($scope, 1,true);
    }

  })

//.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//  $scope.chat = Chats.get($stateParams.chatId);
//})



.controller('DetailCtrl',function($scope){
    $scope.search_res = []
    $scope.init = function () {
      console.log("ready to fetch");
      APP.search($scope, 1,false);
    }
    $scope.request = function(){
      APP.request();
    }

  })


  .controller('SearchCtrl',function($scope){
    $scope.search_res = [];

    $scope.init = function () {
      console.log("ready to fetch");
      APP.search($scope, 1,false);
    };
    $scope.Request = function(itemId,itemName){
      APP.request(itemId,itemName);
    };
  })

.controller('AccountCtrl', function($scope) {
    $scope.search_res = []
    $scope.init = function () {
      console.log("ready to fetch");
      APP.search($scope, 1,false);
    }
/*
    $scope.settings = {
    enableFriends: true
    };
*/


  })
  .controller('OfferingCtrl',function($scope){
    $scope.lentItem=[];
    $scope.Refresh = function(){
      var list = APP.get("ListOfLent");
      var query = new Parse.Query(Item);
      query.containedIn("objectId",list);
      query.find().then(function(results){
        $scope.lentItem = results;
        console.log("lent results" + results.length);
        $scope.$apply();
      }).then(function (){
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  })
  .controller('RequestCtrl',function($scope){
    $scope.reqs=[];

    $scope.Refresh = function(){
      var list = APP.get("ListOfRequest");
      var query = new Parse.Query(Request);
      query.containedIn("objectId",list);
      query.find().then(function(results){
        $scope.reqs = results;
        console.log("find results" + results.length);
        $scope.$apply();
      }).then(function (){
          $scope.$broadcast('scroll.refreshComplete');
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
        console.log("find borrowed results" + results.length);
        $scope.$apply();
      });
    }
  })

  .controller('MainCtrl', function($scope, $ionicModal, $ionicActionSheet, $ionicPopup, $state, $cordovaCamera, $timeout) {
    $scope.HeadProfile = headProfile;
    $scope.LABEL = "GET";

    $scope.photo_arry = [];

    $scope.test = [1,2,3];
    
    

    $scope.newItem = {
      Title : "",
      Desc : ""
    };
    $scope.init = function () {
      console.log("ready to fetch");
      APP.search($scope, 1,true);
    };
    $scope.Request = function(itemId,itemName){
      APP.request(itemId,itemName);
    };


    $scope.photo_arry = [];

    //This is for detail page use only
    $scope.targetItem=null;

    //
    $scope.esc = function(item) {
      $scope.targetItem = item;
      $state.go('detail');
    }

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
      item.set("ImageArry",$scope.photo_arry);
      item.set("Desc",$scope.newItem.Desc);
      item.set("Holder",currentUser.id);
      item.set("Owner", currentUser.get("username"));
      item.set("State", "Available");
      item.set("GeoPoint", GP);
      item.set("requestList", []);
      item.set("Label", $scope.LABEL)
      item.save(null, {
        success: function(item) {
          // Execute any logic that should take place after the object is saved.
          alert("Post Success");
          $scope.newItem.Title = null;
          $scope.newItem.Desc = null;
          $scope.modal.hide();
          APP.get("ListOfPostItem").push(item.id);
          $scope.photo_arry = [];
          if(APP.get("ListOfPostItem").length ==1){
            RequestTimer = setInterval(checkRequest,3000);
          }
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
      $scope.photo_arry = [];
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
          $scope.LABEL = "GIVE";
          $scope.modal.show();
        }
        if(index == 1){
          $scope.LABEL = "GET";
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
              AcceptTimer = setInterval(checkAccept,3000);
            }
            if(APP.get("ListOfPostItem").length!=0){
              RequestTimer = setInterval(checkRequest,3000);
            }
          });
          var GP = new Parse.GeoPoint.current({
            success: function (point){
              console.log("GP Success");
            },
            error: function (error){
              alert(error);
            }
          });
          APP.set("CurrentGP", GP);
          APP.search($scope, 1,false);
          $state.go('tabs.home');
        },
        error: function(user, error) {
          alert(error);
          // The login failed. Check error to see why.
        }
      });
   }

  $scope.showAlert = function(itemId,itemName) {
     var alertPopup = $ionicPopup.alert({
       title: 'Request successfully',
     });
     APP.request(itemId,itemName);
   }

   $scope.LogOut = function() {
    Parse.User.logIn();
    isLogin = false;
    $state.go('signin');
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
                        var ImageName = ID() + ".jpeg";
                        var IMG = new Parse.File(ImageName, { base64: imageData });
                        if(IMG == null){
                          alert("photo save failed");
                          scope.imgURI = "";
                          return;
                        }else{
                          //alert("photo save success");
                        }
                        $scope.photo_arry.push(IMG);
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
                        var ImageName = ID() + ".jpeg";
                        var IMG = new Parse.File(ImageName, { base64: imageData });
                        if(IMG == null){
                          alert("photo save failed");
                          scope.imgURI = "";
                          return;
                        }else{
                          //alert("photo save success");
                        }
                        $scope.photo_arry.push(IMG);
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
                }

                $scope.showLabel = function(u){
                  if(u == "GET"){
                    return " need HELP!";
                  }else{
                    return " can HELP!";
                  }
                }
   ;
  });



