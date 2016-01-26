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
  Name:""
});

var Display = Parse.Object.extend("Display", {
  search_items : []
})

var display = new Display();

var findres = [];

var Customer = Parse.Object.extend("Customer" , {
  ListOfPostItem : {},
  post : function (image, desc, owner){
    var item = new Item();
    item.set("Desc",desc);
    item.set("Image",image);
    item.set("Owner",owner);

    item.save().then(function(object){
        this.ListOfPostItem.add(object);
      },
      function(err){
        alert("Upload Failed");
      }).then(function (object){
        Customer.save();
      },
      function (err){
        alert("Customer Upload Failed");
      });
  },
  search : function ($scope, distance) {
    var query = new Parse.Query(Item);
    query.notEqualTo("Desc","");
    query.find({
      success:function(result) {
        console.log("got something");
        $scope.search_res = result;
        console.log($scope.search_res.length);
      },
      error:function(err){
        alert("Search Failed");
      }
    });
  }
});

var APP = new Customer();
