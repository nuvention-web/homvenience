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

var Test = Parse.Object.extend("Test");

var tquery = new Parse.Query(Test);



// Item class
var Item = Parse.Object.extend("Item",{
  Desc:"",
  Owner:"",
  Name:"",
  State:"",
  Holder:"",

  Requests:[],

  clearRequests : function(){

  }
});

var Display = Parse.Object.extend("Display", {
  search_items : []
})

var display = new Display();

var Request = Parse.Object.extend("Request",{
  itemId:null,
  requesterId:null,
  time:null
});

var Customer = Parse.Object.extend("Customer" , {
  ListOfPostItem : {},
  ListOfRequest:{},
  ListOfGet:{},
  User : null,
  RequestTimer: null, // to check whether there is request
  AcceptTimer: null, // to check whether there is accept

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

  checkAccept:function(){

  },


  accept:function(requestId,itemId,requesterId){
    var query = Parse.Query(Item);
    query.equalTo("objectId",itemId);
    query.find().then(function(results){
      results[0].set("Holder",requesterId);
      results[0].set("State","LentOut");
      results[0].save();
    },function(err){
      alert(err);
    });
  },

  request : function(itemId){
    var newRequest = new Request();
    newRequest.set("ItemId",itemId);
    newRequest.set("RequesterId",this.get("objectId"));
    newRequest.set("Time",new Date());
    newRequest.save().then(function(obj){
      var query = Parse.Query(Item);
      query.equalTo("objectId",itemId);
      query.find().then(function(results){
        var target = results[0];
        target.get("Requests").push(newRequest.get("RequestId"));
        target.save();
      })
    },function(err){
      alert("Request Failed"+err);
    });
  },

  post : function (image, desc, owner,ownerId){
    var item = new Item();
    item.set("Desc",desc);
    item.set("Image",image);
    item.set("Owner",owner);
    item.set("State","Available");
    item.set("Holder",ownerId);


    item.save().then(function(object){
        this.get("ListOfPostItem")[item.get("objectId")] = item;
      },
      function(err){
        alert("Upload Failed");
      }).then(function (object){
        if(this.get("requestTimer") == null) {
          this.set("requestTimer", setInterval(this.checkRequest, 1000));
        }
        Customer.save();
      },
      function (err){
        alert("Customer Upload Failed");
      });
  },
  search : function ($scope, distance) {
    var query = new Parse.Query(Item);
    query.notEqualTo("Desc","");
    query.find().then(function(result) {
      $scope.search_res = result;
      $scope.$apply();
    },
    function(err){
      alert("Search Failed");
    })
  }
});

var Cus = new Customer();
