/**
 * Created by herbertxu on 2/13/16.
 */

var Message = Parse.Object.extend("Message",{
  Username: "",
  Content: "",
  Receiver: "",
  Fetched: false,
  Read:false
});


var MessageBox = Parse.Object.extend("MessageBox",{
  User : null,
  Messages:[],
  Receiver: null,


  reload : function(){
    console.log("Reload messages");
    var box = this;
    var messageQuery = new Parse.Query(Message);
    messageQuery.equalTo("Fetched",false);
    messageQuery.equalTo("Receiver", currentUser.get("username"));
    messageQuery.find().then(function (res){
      for(var i = 0;i<res.length;i++) {
        res[i].set("Fetched", true);
        res[i].save();
        box.relation("Messages").add(res[i]);
      }
    });
    box.save();
  },

  post : function(content){
    var box = this;
    var message = new Message();
    message.set("Username",currentUser.get("username"));
    message.set("Content",content);
    message.set("Receiver",box.get("Receiver").get("username"));
    message.save();
    box.relation("Messages").add(message);
    box.save();
  },

  showUsers : function(scope){
    console.log("Load Friend information");
    var friends = currentUser.relation("Friends");
    var query = friends.query();
    query.find().then(function (res){
      console.log("Find friends" + res.length);
      scope.users = res;
      scope.$apply();
    },function (err){
      console.log("Log friends Failed!!!");
    });
  }
});

var MessageCheckTimer;

/*var reload  = function() {
  console.log("Reload messages");
  var messageQuery = new Parse.Query(Message);
  messageQuery.equalTo("Fetched", false);
  messageQuery.equalTo("Receiver", currentUser.get("username"));
  messageQuery.find().then(function (res) {
    for (var i = 0; i < res.length; i++) {
      res.set("Fetched", true);
      res.save();
      APP.get("MessageBox").get("Messages").push(res);
    }
    APP.get("MessageBox").save();
  });
}*/


