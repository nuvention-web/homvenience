
angular.module('starter.controllers', ['ionic', 'ngCordova'])



.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('NeighborsTabCtrl', function($scope) {})


.controller('SignInCtrl', function($scope, $state, $ionicModal) {
    console.log('SignInCtrl');

    $ionicModal.fromTemplateUrl('templates/Register-modal.html', {
    scope: $scope,
    animation: 'jelly'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.SignUp = function(newUser) {
      var user = new H_User();
      user.set("username", newUser.username);
      user.set("email", newUser.email);
      user.set("Address", newUser.address);
      user.set("password", newUser.password);
      user.signUp(null,{
        success: function(user){
            var newCstm = new Customer();
            newCstm.set("ListOfPostItem", []);
            newCstm.set("ListOfRequest", []);
            newCstm.set("ListOfGet", []);
            newCstm.set("ListOfLent", []);
            newCstm.set("Requests", []);
            user.set("customer", newCstm);
          currentUser = user;
          if(currentUser){
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
            APP.search($scope, 1, false);
            userQuery($scope, currentUser);
            $state.go('tabs.home');
          }
          $scope.closeModal();
        },
        error: function(user, error){
          alert("Error: " + error.code + " " + error.message);
        }
      });
    };
    $scope.openModal = function() {
      console.log("Register Start!");
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
  })


.controller('HomeTabCtrl', function($scope,$state) {
    console.log('HomeTabCtrl');
    $scope.search_res = []
    $scope.init = function () {
      console.log('ready to fetch');
      APP.search($scope, 1,true);
    }

    $scope.eventDetail = function(itemObj){
      $state.go('detail',{itemObj:itemObj});
    }

  $scope.userDetail = function (user){
    $state.go('user-profile',{user:user});
  }


  })

  .controller('ProfileCtrl', function($scope,$stateParams){
    $scope.targetUser = new H_User();
    $scope.targetUser.id = $stateParams.user;
    $scope.targetUser.fetch().then(function (obj){
      console.log($scope.targetUser.get("username"));
    });
  })

//.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//  $scope.chat = Chats.get($stateParams.chatId);
//})



.controller('DetailCtrl',function($scope,$state,$stateParams){
    $scope.Item = new Item();
    $scope.Comments = [];
    $scope.init = function () {
      $scope.Item.id = $stateParams.itemObj;
      console.log("Initializing " +$scope.Item);
      $scope.Item.fetch().then(function(obj){
        obj.relation("Comments").query().find().then(function(list){
          $scope.Comments = list;
          refresh();
        })
        $scope.$apply();
      });
      console.log("Registering Timer");
      $scope.postUpdate = setInterval(refresh,5000);
    }
    $scope.request = function(){
      APP.request();
    }

    $scope.postComment = function(content){
      APP.postComment($scope.Item,content);
      $scope.$apply();
    }

    function refresh (){
      console.log("too young");
      $scope.Item.relation("Comments").query().find().then(function(list){
        $scope.Comments = list;
        for(var i=0;i<$scope.Comments.length;i++){
          console.log($scope.Comments[i].get("Content"));
        }
        $scope.$apply();
      })
    }
    $scope.cancelTimer = function (){
      clearInterval($scope.postUpdate);
    }
    $scope.userDetail = function(user){
      $state.go('user-profile',{user:user});
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
  .controller('OfferingCtrl',function($scope,$state){
    $scope.lentItem=[];
    $scope.Refresh = function(){
      var list = APP.get("ListOfPostItem");
      var query = new Parse.Query(Item);
      query.containedIn("objectId",list);
      query.find().then(function(results){
        $scope.lentItem = results;
        console.log("lent results" + results.length);
        $scope.$apply();
      }).then(function (){
        $scope.$broadcast('scroll.refreshComplete');
      });
      $scope.eventDetail = function (event){
        $state.go('detail',{itemObj:event});
      }
    };

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

  .controller('ChatCtrl',function($scope,$state){
    $scope.users;



    $scope.reloadUser = function (){
      APP.get("MBox").showUsers($scope);
    }


    $scope.chatDetail = function(user){
      console.log(user.get('username'));
      $state.go('chatdetail',{"toUser":user});
    }


  })

  .controller('ChatDetailCtrl',function($scope,$stateParams){
    $scope.toUser = $stateParams.toUser;
    console.log("Received user "+$scope.toUser.get("username") );
    $scope.doneLoading = false;
    $scope.messages;


    $scope.loadChat = function (){
      $scope.chats = APP.get("MBox").showMessage();
      $scope.$apply();
    }


    $scope.getMessages = function(){
      APP.get("MBox").showMessage($scope,$scope.toUser.get("username"));
    }

    $scope.sendMessage = function (){
      var mes = new Message();
      mes.set("Content",$scope.input);
      mes.set("Receiver", $scope.toUser.get("username"));
      mes.set("Username", currentUser.get("username"));
      mes.save();
      $scope.messages.push(mes);
      $scope.$apply();
    }
  })

  .controller('MainCtrl', function($scope, $ionicModal, $ionicActionSheet,
    $ionicPopup, $state, $cordovaCamera, $timeout, $ionicSideMenuDelegate) {
    console.log("MainCtrl");

    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.HeadProfile = headProfile;
    $scope.LABEL = "GET";

    $scope.photo_arry = [];

    $scope.neighborList = [];

    $scope.newItem = {
      Title : "",
      Desc : ""
    };

    currentUser = H_User.current();

    if(currentUser){
      isLogin = true;
      APP = currentUser.get("customer");
      APP.fetch().then(function(obj){
        if(APP.get("Requests").length != 0){
          AcceptTimer = setInterval(checkAccept,3000);
        }
        //if(APP.get("ListOfPostItem").length!=0){
        //  RequestTimer = setInterval(checkRequest,3000);
        //}
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
      APP.search($scope, 1, false);
      userQuery($scope, currentUser);
      $state.go('tabs.home');
    }

    $scope.init = function () {
      console.log("ready to fetch");
      APP.search($scope, 1,true);
    };
    $scope.getNeighbors = function() {
      userQuery($scope, currentUser);
    }
    $scope.Request = function(itemId,itemName){
      APP.request(itemId,itemName);
    };

    $scope.ImgURL = function(imageData){
      URL = "data:image/jpeg;base64," + imageData;
      return URL;
    }

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

    $scope.addFriend = function(user){
      var friends = currentUser.relation("Friends");
      friends.add(user);
      currentUser.save();
    }

    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
   // An alert dialog
     $scope.CreatePostAlert = function() {
       var alertPopup = $ionicPopup.alert({
         template: 'Post Success!'
       });
       alertPopup.then(function(res) {
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
      var temp_arry = [];
      for(i = 0; i < $scope.photo_arry.length; i++){
        var ImageName = ID() + ".jpeg";
        var IMG = new Parse.File(ImageName, { base64: $scope.photo_arry[i] });
        temp_arry.push(IMG);
      }
      var d = new Date();
      item.set("Title", $scope.newItem.Title);
      item.set("ImageArry", temp_arry);
      item.set("Desc",$scope.newItem.Desc);
      item.set("Owner", currentUser);
      item.set("Holder",currentUser);
      item.set("State", "Available");
      item.set("GeoPoint", GP);
      item.set("requestList", []);
      item.set("Label", $scope.LABEL);
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

    $scope.deleteImage = function(u) {

     // Show the action sheet
     var hideSheet = $ionicActionSheet.show({
       buttons: [
         { text: 'View Photo' },
         { text: 'Remove Photo' }
       ],
       cancelText: 'Cancel',
       cancel: function() {
            // add cancel code..
       },
       buttonClicked: function(index) {
        if(index == 0){
        }
        else if(index == 1){
            for(i = 0; i < $scope.photo_arry.length; i++){
              if($scope.photo_arry[i] == u){
                $scope.photo_arry.splice(i, 1);
                return true;
              }
            }
        }
         return true;
       }
     });
   }
    $scope.postShow = function() {
      $scope.photo_arry = [];
      $scope.modal.show();
     // Show the action sheet
    //  var hideSheet = $ionicActionSheet.show({
    //    buttons: [
    //      { text: 'Activity' },
    //      { text: 'Share' },
    //      { text: 'Around me ' }
    //    ],
    //    cancelText: 'Cancel',
    //    cancel: function() {
    //         // add cancel code..
    //    },
    //    buttonClicked: function(index) {
    //     if(index == 0){
    //       $scope.LABEL = "GIVE";
    //       $scope.modal.show();
    //     }
    //     if(index == 1){
    //       $scope.LABEL = "GET";
    //       $scope.modal.show();
    //     }
    //      return true;
    //    }
    //  });
   }


   $scope.SignIn = function(u) {
      H_User.logIn(u.username, u.password, {
        success: function(user) {
          currentUser = H_User.current();;
          isLogin = true;
          APP = currentUser.get("customer");
          APP.fetch().then(function(obj){
            console.log("Customer Fetched");
            if(APP.get("MBox") == null){
              var temp = new MessageBox();
              temp.set("User",currentUser.get("username"));
              temp.set("Messages",[]);
              APP.set("MessageBox", temp);
              temp.save();
            }
            else {
              APP.get("MBox").fetch().then(function (res) {
                  console.log("Message Box fetched");
                  MessageCheckTimer = setInterval(APP.get("MBox").reload, 5000);
                  console.log("Message Timer Set!");
                },
                function (err) {
                  console.log("Box corrupted!");
                });
            }
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
          userQuery($scope, currentUser);
          $state.go('tabs.neighbors');
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
    H_User.logIn();
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
          $scope.photo_arry.push(imageData);
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
          $scope.photo_arry.push(imageData);
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
    };
  });
