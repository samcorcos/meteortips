PlayersList = new Mongo.Collection('players');

if(Meteor.isClient){
  // this code only runs on the client
  
  Template.leaderboard.helpers({
    "players": function(){
      return PlayersList.find()
    },
    "otherHelperFunction": function(){
      return "Some other function"
    }
  });
  
  Template.leaderboard.events({
    "click .player": function(){
      console.log("You clicked on a player element");
    }
  })
  
  
  
  
  
  
  
}

if(Meteor.isServer){
  // this code only runs on the server
}

