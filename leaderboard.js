PlayersList = new Mongo.Collection('players');

if(Meteor.isClient){
  // this code only runs on the client
  

  
  Template.leaderboard.helpers({
    "players": function(){
      return PlayersList.find({}, {sort: {score: -1, name: 1}});
    },
    'selectedClass': function(){
      var playerId = this._id._str;
      var selectedPlayer = Session.get("selectedPlayer");
      if (playerId == selectedPlayer) {
        return "selected"
      }
    }
  });

      
  Template.leaderboard.events({
    "click .player": function(){
      var playerId = this._id._str;
      Session.set("selectedPlayer", playerId);
    },
    "click .increment": function() {
      var selectedPlayer = Session.get("selectedPlayer");
      PlayersList.update(selectedPlayer, {$set: {score: 5} });
    }
  })
  
  
}

if(Meteor.isServer){
  // this code only runs on the server
}

