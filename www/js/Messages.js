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


  reload : function(){
    console.log("Reload messages");
    var box = this;
    var messageQuery = new Parse.Query(Message);
    messageQuery.equalTo("Fetched",false);
    messageQuery.equalTo("Receiver", currentUser.get("username"));
    messageQuery.find().then(function (res){
      for(var i = 0;i<res.length;i++) {
        res.set("Fetched", true);
        res.save();
        box.Messages.push(res);
      }
      box.save();
    });
  },

  post : function(content, receiver){
    var box = this;
    var message = new Message();
    message.set("Username",currentUser.get("username"));
    message.set("Content",content);
    message.set("Receiver",receiver);
    message.save();
  },

  showUsers : function(){
    var names = {};
    var box = this;
    for(var i =0;i<Messages.length;i++){
      var name = box.Messages[i].get("Username");
      if(!names.contains(name)){
        names[name] = 1;
      }
      else{
        names[name] +=1;
      }
    }
    return names;
  },

  showMessage : function(username){
    var box = this;
    var messages = [];
    var messageName;
    for(var i = 0; i<box.Messages.length;i++){
      messageName  = box.Messages[i].get("Username");
      if(messageName  == username){
        messages.push(box.Messages[i]);
      }
    }
    return messages;
  }
});

var MessageCheckTimer;

var reload  = function() {
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
}


