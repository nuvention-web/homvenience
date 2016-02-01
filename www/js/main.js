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


var base64 = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";

var isLogin = false;

Parse.User.logOut();

photo_Arry = [];

alert(photo_Arry.length);

var currentUser = Parse.User.current();
if(currentUser){
  isLogin = true;
}
else{
  console.log('Failed');
}


// Item class
var Item = Parse.Object.extend("Item",{
  Title:"",
  Desc:"",
  Owner:"",
  State:"",
  Holder:"",
  ImageArry:[],
  requestList:[],

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
      obj.set("State","LentOut");
      obj.set("Holder",requesterId);
      obj.clearRequests();

      obj.save().then(function(obj){
        console.log("Start moving");
        app.set("ListOfPostItem",delArray(itemId,app.get("ListOfPostItem")));
        app.get("ListOfLent").push(itemId);
        checkRequest();
        if(app.get("ListOfPostItem").length == 0){
          window.clearInterval(RequestTimer);
        }
      });
      console.log("accpeted!");

    },function(err){
      alert("This item has been lent out!");
    });
    //this.set("ListOfPostItem", this.get("ListOfPostItem").slice(0,))
  },

  request : function(itemId,itemName){
    var app = this;
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
          if(req.length!=0) {
            AcceptTimer = setInterval(checkAccept, 1000);
            console.log("set finished");
          }
          app.save().then(function(saved){
            alert("Request Sent");
          },function(err){
            alert("Request Failure2");
          });
        },function(err){
          alert("Request Failure");
        });
      },function(err){
        alert(err);
      });
    },function(err){
      alert("Request Failed"+err);
    });
  },

  post : function (title, image, desc, owner){
    var app = this;
    var item = new Item();
    item.set("Title", title)
    item.set("Desc",desc);
    item.set("Owner",currentUser.get("username"));
    item.set("State","Available");
    item.set("Holder",currentUser.id);

    item.save().then(function(object){
        this.get("ListOfPostItem")[object.id] = item;
      },
      function(err){
        alert("Upload Failed");
      }).then(function (object){
        app.save();
      },
      function (err){
        alert("Customer Upload Failed");
      });
  },
  search : function ($scope, distance) {
    var query = new Parse.Query(Item);
    query.notEqualTo("Owner",currentUser.get("username"));
    query.notEqualTo("Holder",currentUser.id);
    query.find().then(function(result) {
      $scope.search_res = result;
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
  for(var j in posted){
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
    });
  }
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
