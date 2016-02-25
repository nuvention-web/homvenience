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


  reload : function(obj){
    console.log("Reload messages");
    var box = APP.get("MBox");
    var messageQuery = new Parse.Query(Message);
    messageQuery.equalTo("Fetched",false);
    messageQuery.equalTo("Receiver", currentUser.get("username"));
    box.get("Messages");
    messageQuery.find().then(function (res){
      for(var i = 0;i<res.length;i++) {
        res.set("Fetched", true);
        res.save();
        box.get("Messages").push(res);
      }
    });
    box.save();
  },

  post : function(content, receiver){
    var box = APP.get("MBox");
    var message = new Message();
    message.set("Username",currentUser.get("username"));
    message.set("Content",content);
    message.set("Receiver",receiver);
    message.save();
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
  },

  showMessage : function(scope, username){
    var box = APP.get("MBox");
    var messages = [];
    var messageName;
    var raw = box.get("Messages");
    for(var i = 0; i<raw.length;i++){
      messageName  = raw[i].get("Username");
      if(messageName  == username || messageName == currentUser.get("username")){
        messages.push(raw[i]);
      }
      scope.doneLoading = true;
      scope.messages = messages;
      scope.$apply();
    }
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


