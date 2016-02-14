/**
 * Created by herbertxu on 1/24/16.
 */


Parse.initialize("KnJk0tRr89V3CoheSEVz2Q89B6K1DMjLFGu6Kjj0", "YUFmkfELE7CXIHVfI8tnIjjPzcTFr7qSacEAWJmC");

/*var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
testObject.save({Message: "Hello World"}, {
  success: function(object) {
    $(".success").show();
  },
  error: function(model, error) {
    $(".error").show();
  }
});*/
var ID = function () {
  return Math.random().toString(36).substr(2, 9);
};
var isLogin = false;
var headProfile = {};
headProfile["maktf"] = "img/fun.png";
headProfile["maounan"] = "img/Profile2.png";
headProfile["hszwk"] = "/img/DOGE.png"
var H_User = Parse.User.extend("H_User", {
  Profile_image:null,
  SelfDes:"",
  tags:[],
  posts:[]
});



// Item class
var Item = Parse.Object.extend("Item",{
  Title:"",
  Desc:"",
  Owner:null,
  State:"",
  Holder:null,
  ImageArry:[],
  requestList:[],
  Label:"",
  Date: null,
  clearRequests : function(){
    this.set("requestList" ,[]);
  }
});

var Display = Parse.Object.extend("Display", {
  search_items : []
})

var display = new Display();

var Request = Parse.Object.extend("Request",{
  itemId:null,
  requesterId:null,
  time:null,
  requesterName: null,
  itemName:""

});

var Customer = Parse.Object.extend("Customer" , {
  ListOfPostItem : [],
  ListOfRequest:[],//to store received requests
  ListOfGet:[],
  ListOfLent:[],
  Requests:[],// to store sent requests
  Denied:[],
  MessageBox:null,


  checkRequest : function($scope){
    var ids = [];
    for(var item in this.ListOfPostItem){
      ids.push(item.get("objectId"));
    }
    var query = new Parse.Query(Request);
    query.containedIn("objectId",ids);
    query.find().then(function(results){
      if(results.length != 0){
        $scope.notify = results;
      }

    },function(err){
      alert(err);
    })
  },




  accept:function(requestId,itemId,requesterId){
    var app = this;
    var query = new Parse.Query(Item);
    query.get(itemId).then(function(obj){
      if(obj.get("State") == "LentOut"){
        alert("Oops! This item has been lent out!");
      }
      else {
        obj.set("State", "LentOut");
        obj.set("Holder", requesterId);
        obj.clearRequests();
        obj.save().then(function (obj) {
          console.log("Start moving");
          app.set("ListOfPostItem", delArray(obj.id, app.get("ListOfPostItem")));
          app.get("ListOfLent").push(obj.id);
          console.log("Item "+obj.id+" moved");
          checkRequest();
          if (app.get("ListOfPostItem").length == 0) {
            window.clearInterval(RequestTimer);
          }
        });
        console.log("accpeted!");
      }
    });
    //this.set("ListOfPostItem", this.get("ListOfPostItem").slice(0,))
  },

  request : function(itemId,itemName){
    var app = this;
    console.log("request"+itemId+itemName);
    var newRequest = new Request();

    newRequest.set("itemId",itemId);
    newRequest.set("requesterId",currentUser.id);
    newRequest.set("time",new Date());
    newRequest.set("requesterName",currentUser.get("username"));
    newRequest.set("itemName",itemName);
    newRequest.save().then(function(obj){
      var query = new Parse.Query(Item);
      query.get(itemId).then(function(res){
        var rel = res.get("requestList");
        rel.push(obj.id);
        res.save().then(function(call){
          var req = app.get("Requests");
          req.push(obj.id);
          if(req.length==1) {
            AcceptTimer = setInterval(checkAccept, 2000);
            console.log("set Interval finished");
          }
          app.save().then(function(saved){
            //alert("Request Sent");
          },function(err){
            alert("Request Failure2");
          });
        },function(err){
          alert("Request Failure");
        });
      },function(err){
        alert("Item Request Failed");
      });
    },function(err){
      alert("You may have had this");
    });
  },

  search : function ($scope, distance,self) {
    var query = new Parse.Query(Item);
    if(self == false) {
      query.notEqualTo("Owner", currentUser);
      query.notEqualTo("Holder", currentUser);
    }
    query.equalTo("State","Available");
    query.find().then(function(result) {
      $scope.search_res = result;
      $scope.search_res.reverse();
      $scope.$apply();
      console.log($scope.search_res.length);
    },
    function(err){
      alert("Search Failed");
    })
  }
});

var APP;
var AcceptTimer;
var RequestTimer;

var checkRequest = function(){
  //Only for test
  //
  console.log("start check request");
  var posted = APP.get("ListOfPostItem");
  var query = new Parse.Query(Item);
  var res = [];
  var temp;
  var itemid;
  query.containedIn("objectId",posted);
  query.find().then(function(results){
    for(var i = 0;i<results.length;i++){
      temp = results[i].get("requestList");
      for(var j in temp) {
        res.push(temp[j]);
      }
    }
    APP.set("ListOfRequest",res);
    APP.save();
    console.log("Request Updated!");
  });
  /*for(var j in posted){
    itemid = posted[j];
    query.get(itemid).then(function(item){
      temp = item.get("requestList");
      var reqid;
      for(var i in temp){
        reqid = temp[i];
        res.push(reqid);
      }
      APP.set("ListOfRequest",res);
      APP.save();
      console.log("Request Fetched");
    },function(err){
      alert("Item Error");
    });
  }*/
};

var checkAccept = function(){
  var requests = APP.get("Requests");
  console.log("checkAccept");
  var query = new Parse.Query(Request);
  var itemid;
  var query4item = new Parse.Query(Item);
  var req;
  for(var i in requests){
    req = requests[i];
    query.get(req).then(function(obj){
      itemid = obj.get("itemId");
      query4item.get(itemid).then(function(item){
        if(item.get("State") == "LentOut") {
          if (item.get("Holder") == currentUser.id) {
            var list = APP.get("ListOfGet");
            var find = false;
            for(var i =0;i<list.length;i++){
              if(list[i] == itemid){
                find = true;
                break;
              }
            }
            if(find == false)
              APP.get("ListOfGet").push(itemid);
          }
          obj.destroy();
          APP.set("Requests",delArray(obj.id,APP.get("Requests")));
          APP.save();
          if(APP.get("Requests").length == 0){
            window.clearInterval(AcceptTimer);
          }
          console.log("destroy"+ req);
        }
      });
    });
  }
  APP.save();
};

var delArray = function (target,array){
  var res = [];
  for(var i = 0;i<array.length;i++){
    if(array[i] != target) {
      res.push(array[i]);
    }
  }
  return res;
}

var userQuery = function ($scope, user){
  var UserQuery = new Parse.Query(H_User);
  UserQuery.notEqualTo("username", user.get("username"));
  UserQuery.find({
    success: function(results) {
      alert("Successfully retrieved " + results.length + " H_User.");
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        alert(object.id + ' - ' + object.get('username'));
      }
      $scope.neighborList = results;
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}


