angular.module('starter.controllers', [])

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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

  .controller('wrapperCtrl',function($scope){
<<<<<<< HEAD
    console.log();
    APP.search(1);
    $scope.Message = display.search_items.length;

||||||| merged common ancestors
    APP.search(1);
    $scope.Message = display.search_items.length;

=======
    $scope.Message = testObject.get("Message");
    //tquery.equalTo("index",1);
    //tquery.find().then(function(result){$scope.Message = result[0].get("Information");},function (err) {$scope.Message = "Failed";});
    APP.search($scope,1);
>>>>>>> f22a4f1e5f7dface8830045a7d74bea876a96284
  })

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
