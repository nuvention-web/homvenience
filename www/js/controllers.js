angular.module('starter.controllers', ['ionic', 'ngCordova'])



.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('NeighborsTabCtrl', function($scope, $http) {
    $scope.user = currentUser;
    userQuery($scope, currentUser);
    $scope.getNeighbors = function() {
      userQuery($scope, currentUser);
    }
    $scope.doRefresh = function() {
    $http.get('#/tab/neighbors')
     .success(function() {
      userQuery($scope, currentUser);
      APP.search($scope, 1,true);
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
    }
})


.controller('SignInCtrl', function($scope, $state, $ionicModal) {
    console.log('SignInCtrl');


    $ionicModal.fromTemplateUrl('templates/Register-modal.html', {
    scope: $scope,
    animation: 'jelly'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    currentUser = H_User.current();

    if(currentUser){
      isLogin = true;
      APP = currentUser.get("customer");
      APP.fetch().then(function(obj){
        //if(APP.get("Requests").length != 0){
        //  AcceptTimer = setInterval(checkAccept,3000);
        //}
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
      console.log("set time");
      currentUser.updatedAt = Date();
      $state.go('tabs.home');
    }



    $scope.SignUp = function(newUser) {
      var user = new H_User();
      user.set("username", newUser.username);
      user.set("email", newUser.email);
      user.set("Address", newUser.address);
      user.set("password", newUser.password);
      var newCstm = new Customer();
      newCstm.set("ListOfPostItem", []);
      newCstm.set("ListOfRequest", []);
      newCstm.set("ListOfGet", []);
      newCstm.set("ListOfLent", []);
      newCstm.set("Requests", []);
      user.set("customer", newCstm);

      user.signUp(null,{
        success: function(user){
          currentUser = user;
          if(currentUser){
            isLogin = true;
            APP = currentUser.get("customer");
            APP.fetch().then(function(obj){
              //if(APP.get("Requests").length != 0){
              //  AcceptTimer = setInterval(checkAccept,3000);
              //}
              //if(APP.get("ListOfPostItem").length!=0){
              //  RequestTimer = setInterval(checkRequest,3000);
             // }
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

   $scope.SignIn = function(u) {
      H_User.logIn(u.username, u.password, {
        success: function(user) {
          currentUser = H_User.current();;
          isLogin = true;
          APP = currentUser.get("customer");
          APP.fetch().then(function(obj){
            console.log("Customer Fetched");
            //if(APP.get("Requests").length != 0){
            //  AcceptTimer = setInterval(checkAccept,3000);
           // }
            //if(APP.get("ListOfPostItem").length!=0){
            //  RequestTimer = setInterval(checkRequest,3000);
            //}
            userRef = FirebaseRef.child("Users").child(currentUser.get("username"));
            messageBoxRef = userRef.child("MessageBox");
            messageBoxRef.on("value",function(snapshot){
              MessageBox = snapshot.val();
              console.log("MessageBox loaded");
              console.log(MessageBox);
            });
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
          $state.go('tabs.home');
        },
        error: function(user, error) {
          alert(error);
          // The login failed. Check error to see why.
        }
      });
      $scope.user = currentUser;
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


.controller('HomeTabCtrl', function($scope,$state, $http) {
  $scope.user = currentUser;
    console.log('HomeTabCtrl');
    curTime = Date.now();
    $scope.search_res = [];

    $scope.init = function () {
      console.log('ready to fetch');
      APP.search($scope, 1,true);
    }

    $scope.doRefresh = function() {
    $http.get('#/tab/home')
     .success(function() {
      console.log('ready to fetch');
      APP.search($scope, 1,true);
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
    }

    $scope.eventDetail = function(itemObj){
      $state.go('detail',{itemObj:itemObj});
    }

  $scope.userDetail = function (user){
    $state.go('user-profile',{user:user});
  }


  })

  .controller('ProfileCtrl', function($scope,$state,$stateParams){
    $scope.targetUser = new H_User();
    $scope.targetUser.id = $stateParams.user;
    $scope.targetUser.fetch().then(function (obj){
      console.log($scope.targetUser.get("username"));
      if(Users[obj.get("username")] == null){
        Users[obj.get("username")] = $scope.targetUser;
      }
    });
    $scope.chatDetail = function(name){
      $state.go("chatdetail",{username:name});
    }
  })

  .controller('SessionsCtrl', function($scope,$state){
    $scope.Sessions = [];
    for(var p in MessageBox){
      var obj = {};
      obj.name = p;
      console.log(p);
      $scope.Sessions.push(obj);
    }
    $scope.chatDetail = function(name){
      $state.go("chatdetail",{username:name});
    }
  })

.controller('ChatDetailCtrl', function($scope, $stateParams) {
  $scope.toUser = $stateParams.username;
  $scope.toUserObj = Users[$scope.toUser];
  $scope.me = currentUser;
  console.log("show" + $scope.toUser);
  $scope.messages = [];
  $scope.input={};
  $scope.messagesRef = null;
  $scope.doneLoading = false;

   if(MessageBox == null || MessageBox[$scope.toUser]==null){
     var obj = {};
     obj[$scope.toUser] = guid();
     messageBoxRef.update(obj);
     var obj2 = {};
     obj2[currentUser.get("username")] = obj[$scope.toUser];
     FirebaseRef.child("Users").child($scope.toUser).child("MessageBox").update(obj2);
     //var check = setTimeInterval(function(){
     //  console.log("check update");
     //  if(!MessageBox == null && !MessageBox[$scope.toUser]==null){
     //    clearInterval(check);
     //  }
     //},500);
   }

   var id = MessageBox[$scope.toUser];

   console.log(userRef);


  var SessionRef = FirebaseRef.child("MessageSession").child(MessageBox[$scope.toUser]);
  console.log("Session loaded" + MessageBox[$scope.toUser]);
  SessionRef.on("child_added",function(childsnapshot,prevchildkey){
    $scope.messages.push(childsnapshot.val());
    console.log($scope.messages.length);
    console.log(childsnapshot.val().content);
  });

  $scope.$apply();

  $scope.sendMessage = function(){
    var newMessage = {};
    newMessage.content = $scope.input.message;
    newMessage.poster = currentUser.get("username");
    $scope.input = {};
    SessionRef.push(newMessage);
  }




})



.controller('DetailCtrl',function($scope,$state,$stateParams){
    $scope.Item = new Item();
    $scope.input = {Comment:"Hi"};
    $scope.Comments = [];
    $scope.Liker = [];
    $scope.loaded = [];
    $scope.init = function () {
      $scope.Item.id = $stateParams.itemObj;
      console.log("Initializing " +$scope.Item);
      $scope.Item.fetch().then(function(obj){
        obj.relation("Comments").query().find().then(function(list){
          $scope.Comments = list;
          $scope.Comments.sort(function(a, b){return a.updatedAt - b.updatedAt});
          for(var i = 0;i<$scope.Comments.length;i++) {
            $scope.loaded.push($scope.Comments[i].id);
          }
          refresh();
        }).then(function () {
          obj.relation("Liker").query().find().then(function (res) {
            $scope.Liker = res;
          });
          $scope.$apply();
        }
        )
      });
      console.log("Registering Timer");
      $scope.postUpdate = setInterval(refresh,1000);
    }
    $scope.request = function(){
      APP.request();
    }

    $scope.postComment = function(content){
      //console.log($scope.input.commentinput);
      console.log("Comment:" + content);
      $scope.input.commentinput = "";
      //console.log($scope.input.commentinput);
      APP.postComment($scope.Item,content);
    }

    $scope.like = function(){
      var tar = -1;
      for(var i = 0 ;i<$scope.Liker.length;i++){
        if($scope.Liker[i].id === currentUser.id){
          var relation = $scope.Item.relation("Liker");
          relation.remove(currentUser);
          currentUser.relation("Likes").remove($scope.Item);
          tar = i;
          break;
        }
      }
      if(tar === -1){
        $scope.Item.relation("Liker").add(currentUser);
        currentUser.relation("Likes").add($scope.Item);
        $scope.Liker.push(currentUser);
      }
      else{
        $scope.Liker.splice(tar,1);
      }
      currentUser.save();
      $scope.Item.save();
      $scope.$apply();
    }

    function refresh (){
      console.log("too young");

      var q = $scope.Item.relation("Comments").query();
      q.notContainedIn("objectId",$scope.loaded).find().then(function(list){
        //$scope.Comments = list;
        for(var i=0;i<list.length;i++){
          $scope.Comments.push(list[i]);
          $scope.loaded.push(list[i].id);
          console.log($scope.Comments[i].get("Content")+"good!");
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

    $scope.Request = function(itemId,itemName){
      APP.request(itemId,itemName);
    };
  })

.controller('AccountCtrl', function($scope) {
    $scope.search_res = [];
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

  .controller('ModalCtrl', function($scope, $ionicModal, $ionicActionSheet,
    $ionicPopup, $state, $cordovaCamera, $timeout, $ionicSideMenuDelegate) {

    $scope.photo_arry = [];

    $scope.newItem = {
      Title : "",
      Desc : ""
    };

    $scope.Request = function(itemId,itemName){
      APP.request(itemId,itemName);
    };

    $scope.ImgURL = function(imageData){
      URL = "data:image/jpeg;base64," + imageData;
      return URL;
    }

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
      item.set("postType", "post-type1");
      item.save(null, {
        success: function(item) {
          // Execute any logic that should take place after the object is saved.
          alert("Post Success");
          $scope.newItem.Title = null;
          $scope.newItem.Desc = null;
          $scope.modal.hide();
          APP.get("ListOfPostItem").push(item.id);
          $scope.photo_arry = [];
          //if(APP.get("ListOfPostItem").length ==1){
          //  RequestTimer = setInterval(checkRequest,3000);
          //}
          APP.save();
        },
        error: function(item, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to create new object, with error code: ' + error.message);
        }
      });
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

  })

  .controller('MainCtrl', function($scope, $ionicModal, $ionicActionSheet,
    $ionicPopup, $state, $cordovaCamera, $timeout, $ionicSideMenuDelegate) {



    $scope.GP = new Parse.GeoPoint();

    $scope.GetDistance = function(Target) {
      if($scope.GP == null || Target == null)
        return "0 miles";
      else
        return $scope.GP.milesTo(Target) + "miles";
    }
    console.log("MainCtrl");
    curTime = Date.now();
    $scope.getTime = function(time) {
      var interval = (curTime - time.valueOf())/1000;
      interval /= 60;
      interval = interval < 0 ? 0 : interval;
      if(interval < 60)
        return Math.floor(interval) + "m";
      interval /= 60;
      if(interval < 24)
        return Math.floor(interval) + "h";
      interval /= 24;
      if(interval < 7)
        return Math.floor(interval) + "d";
      interval /= 7;
      if(interval < 4)
        return Math.floor(interval) + "w";
      interval /= 4;
      if(interval < 12)
        return Math.floor(interval) + "m";
      return Math.floor(interval) + "m";
    };

    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.HeadProfile = headProfile;
    $scope.LABEL = "GET";

    currentUser = H_User.current();



    $scope.currentUser = currentUser;
    if(currentUser){
      isLogin = true;
      APP = currentUser.get("customer");
      APP.fetch().then(function(obj){
        //if(APP.get("Requests").length != 0){
        //  AcceptTimer = setInterval(checkAccept,3000);
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
        console.log("set time");
        currentUser.set("updatedAt", Date());
      APP.set("CurrentGP", GP);
      APP.search($scope, 1, false);
      userQuery($scope, currentUser);
      $state.go('tabs.home');


      //To initialize the Message configuration
      userRef = FirebaseRef.child("Users").child(currentUser.get("username"));
      messageBoxRef = userRef.child("MessageBox");
      messageBoxRef.on("value",function(snapshot){
        MessageBox = snapshot.val();
        console.log("MessageBox loaded");
        console.log(MessageBox);
      });
      //====================
    }

    $scope.getNeighbors = function() {
      userQuery($scope, currentUser);
    }
    $scope.Request = function(itemId,itemName){
      APP.request(itemId,itemName);
    };


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


    $scope.postShow = function() {
      $scope.photo_arry = [];
      $scope.modal.show();
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

  $scope.getSex = function(user) {
    if(true)
      return "../img/male.png";
    else {
      return "../img/female.png"
    }
  }

  // console.log($scope.user.get("Profile"));
  //bar上面的两种状态
   // $scope.Header = function(){
   //  if(!isLogin)
   //    return "button button-clear icon ion-log-in";
   //  else
   //    return "button button-clear icon ion-log-out";
   // }

  });
