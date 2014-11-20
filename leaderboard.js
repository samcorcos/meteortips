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
      var playerId = this._id;
      Session.set("selectedPlayer", playerId);
    }
  })
  
  // Sessions are used to store small pieces of data that aren't saved to the database and won't be remembered on return visits. This sort of data might not sound useful, but it is. 
  // Session.set takes in two arguments. 
  // First, passing through a name for teh session. We're calling our session "selectedPlayer"
  // Second, we're passing through a value for the session. This is the data stored in the session itself. 
  
  // We're passing in "this", which depends on it's context. In this context, "this" refers to the player that has been clicked
  // The underscore in the _id doesn't have any special significance. It's just a way of showing that it's the mongodb identifier.
  
}

if(Meteor.isServer){
  // this code only runs on the server
}

