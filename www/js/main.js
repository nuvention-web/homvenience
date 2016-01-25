/**
 * Created by herbertxu on 1/24/16.
 */


Parse.initialize("KnJk0tRr89V3CoheSEVz2Q89B6K1DMjLFGu6Kjj0", "YUFmkfELE7CXIHVfI8tnIjjPzcTFr7qSacEAWJmC");

var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
testObject.save({Message: "Hello World"}, {
  success: function(object) {
    $(".success").show();
  },
  error: function(model, error) {
    $(".error").show();
  }
});
var Test = Parse.Object.extend("Test");

var tquery = new Parse.Query(Test);

function abc(){

}


// Item class
var Item = Parse.Object.extend("Item")


