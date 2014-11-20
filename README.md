#Notes

To begin, let's create a second template

template is addPlayerForm, which will allow us to add a player to our... database

We include a {{> addPlayerForm}} to the html page, because this is how we reference templates

inside the template, we need to create a form with two elements

a text field with the name set to playerName

a submit button with the value attribute set to Add Player

    template addPlayerForm
      form
        input type,text name,playerName
        input type,submit value,Add Player
      form
    template

We need another event for this so we can do something when we submit

    template addPlayerForm events
      submit form : function() 

    (end)

Why don't we just use click? It's because users can submit forms using a number of means, including the return key

There's a problem... When we submit the form, the browser refreshes the page, so our message doesn't appear int he console

When we create and place the form, the browser assumes that we want the data to be sent somewhere else
Most of the time, this is convenient. Forms are usually used to send data seomewhere else

When working with Meteor, though, its not what we want, but since we're not defining where we want the data to go, the page just refreshes

We always need to disable the default behavior that the browser attaches to forms

When an event is triggered from within a meteor app, we can access information about that event as it occur
That might sound weird, but we can pass in "event.type" to the event form (and console log it)

This makes two things happen:

First, whatever keyword passed through as the first parameter of an event's function becomes a reference for the event. 

Because we've passed through the keyword "event", we're able to reference teh event inside the events function using that keyword

You can use whatever keyword you want, but most people use event

Second, the event.type part is a reference to the event object and its type property

As a result the code should output "submit" to the console since that is the type of the event we triggered

We want to use preventDefault to stop the event from doing it's default activity (the refresh)

event.preventDefault()

We then create a var playerNameVar

and set it equal to event.target.playerName

var palyerNameVar = event.target.playerName;

HEre, this statement uses the event oject to grab the html element where the name attribute is set to playerName

The problem is that it's going to give us the entire html tag...

What we want to do is use the .value element to ge the person's actual name

We then need to use MongoDB insert to get it into our database in teh same call

    "submit form": function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      PlayersList.insert({
      name: playerNameVar,
      score: 0
      })
    }

Creating the ability to remove players is also important

create a new button

To remove a player from the collection, we can use the remove() function

    "click .remove": function() {
    var selectedPlayer = Session.get("selectedPlayer");
    PlayersList.remove(selectedPlayer);
    }


All we need to do to get this to work is pass in a unique ID to remove() and it will remove it from the collection

_____________

Now we have to implement usernames and accounts so we can have multiple leaderboards which will allow us to keep track of different things


To fix this, we need to make it so that:

users can register for and log in to the application
logged out users wont see the add player form
every user will hvae their own, unique leaderboard

while this sounds like a lot of functionality, it's not a lot of code

Every meteor projcet has access to a number of official packages

We're only going to focus on officla packages

You might think that the first step is to create a collection for user's data

Then, you might expect to writ ethe logic for registration and email verification, and passwords, and all that stuff

or: meteor add accounts-password

This package creates a colelction to store the data of our users

gives us a range of functions

Ther eare also other login provider packages that allow users to login to the app through services like google or facebook or github or meteor

A collection was created to store the data

This collection is known as Meteor.users

It works the same way as any other collection that we might create ourselvs

IF you enter the follwing into the console: Meteor.users
IT will confirm that you hae in fact found a database

We can us the familiar find and fetch to get data:

    Meteor.users.find().fetch()  
    
What about hte front end? That also comes for free

Add accounts-ui package, which we want to put between teh body tags

PThis is not just some dummy interface, its fully functional without even needing configuration

you can regster, login , and logoit

we dont want unregistered people to be able to add people to the list

we start with teh addPlayerForm template

    template name="addplayerForm"
      if currentUser
        form
          input type=text name=playerName
          input type=submit value=Add Player
        form
      if
    template
    
Here, we're creating a conditional with teh spacebars syntax called "currentUser"

Where does that object come from? IT comes from accounts-password

If the user is logged in, the currentUser field will return true, so they can get in

__________

Another thing our leaderboard needs os the ability to have one leaderborad per usre

To begin, take a look at the submit form event:

    "submit form": function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      PlayerList.insert({
        name: playerNameVar,
        score: 0
      })
    }
    
Beneath playerNameVar, write:

    var currentUserId = Meteor.userId(); 

HEre, we're creating this currentUSerId variable which stores the value returned by this Meteor.userId()

    var currentUserId = Meteor.userId();

IT simply returns the unique id of teh currently logged in user

From there we will create a "createdBy" field insude teh insert function and pass through teh currentUserId variable

    PlayersList.insert({
      name: playerNameVar,
      score: 0,
      createdBy: currentUserId
    })

As a result, when a user adds a player to the leaderboard, the unique id of that tuser wil be associated with the player that's being aded

We will not modify the player function that's attaache dot hte "leaderboard" template

Now we're modifyting the function to return teh players form teh collection where the createdBy fienld matches the uniqueId fo the currently logged in user

    'player': function() {
      var currentUserId = MEteor.userId();
      return PlayersList.find({createdBy: currentUSerId}, {sort: {score: -1, name: 1}})
    }
    
This ensure that users will only see players they add to the leaderboard, creating the effect of a unique leaderaboard

________

On to Publish and Subscribe

We havent talked about securuty

First, publicaations and subscriptions

IF you create three players from two different user acounts...

If you log out of the accounts, and inside Console, use PlayersList.find().fetch(), you will get all the data from teh collection

Unless we turn off this feature, every user will ahve the same access to data

This method exists because it's convenient

We've used find and fetch functons that have been great tools for managing and observing data

The functinoality that allows all this work is the autopublish package

if we remove this proejct, users wont be able to access any data through the console. But... It will also break the app

removing autopublish makes databases inaccessible form the console

but, if we log into our account, we cant see our own data!!

We not only made it inaccessible to the console, we made it inaccessible to the entire client!!

we need something int eh middle. 

We;ve been wrigin all our code in the isClient conditional

this is because weve been writing code thats meant to run in the browser

all of the code in the is client has been linked to one of the tmaplesat

there are plenty of times to run client on the server.

To demonstarte, just writnge the following in isServer

We still have free reign over our data in the server bceause code that is executed in teh server is inherently trusted

So while we've stopped ussers of the app from accessing data, we acn continue to retrieve the data on the server

users will never have access t the server

Add MEteor.publish(); to the console, then

    Meteor.publish("thePlayers");

then... a second argument

    Meteor.publish("thePlayers", function() {
      return PlayersList.find();
    })

This code will duplicate the functionality of the autppblish package by returning all teh daat

Because the MEteor.publish function is executing on the server, we can subscribe to the data from teh isClient

if you imagine that publish is the function that transmits the data, then sublscrine is the function that cathes the data

Inside the isClient, write:

Meteor.subscribe("thePlayers")l

Then you'll get all teh data you wanted

________

Precice publications

we now want publish to only publish data that belongs to the currently logged in user.

1. logged in users will only hav eaccess to their own data
2. logged out users wont have access to any data

In the end, it will have the same functionaly, but wont be vulnerable to attacks in the console

To achieve this, we need to accest the unique id ofthe logged in user from insude meteor.pbulsh function.  

We can't however use the Meteor.userId() function we talked about earlier.

Instead, when we are inside a publish function, we have to write "this.userId"

But even though the syntax is different, the end result is the same. 

    Meteor.publish("thePlayers", function(){
      var currentUserId = this.userId;
      return PlayersList.find({createdBy: currentUserId})
    })

IF youre logged in, youll only see the data the belongs to your user id

Also important to note, we can simplify teh player function because w are no longers orting by createdBy

__________

In teh previous chapter we talked about hte two security issues that are default included to make htings easy to navigate

We remved autopublish

But now, there is another issue--people can still insert data to the database from the console

This is all in the "insecure" package, which we will now remove

1. WE can no longer give points to teh players
2. We can no longer take points away
3. We can no longer remove players or add them to the list

Almost all of the features stopped working

We can fix this with a method

So far, all of our insert, update and remove functions have been in teh isClient conditional

this was quick and easy

but it's also why it was insecure. we've been placing sensitive functions on the client, in the browser

The alternate is the isServer, whic means

1. database-related code will execute within the trusted environment o fhte server
2. users wont bea ble to use the funciton sform in teh scondolse sin they dont ahve acess to the server

The application will worjk again once we move them to the server (a migration)

To achieve this migration, we need to create our first "Meteor Method"

methods are blocks of code that are executed on teh server after being triggered by the client

    Meteor.methods({
      "sendLogMessage": function(){
      console.log("hello world");
      }
    })

Then, we will go to the client and have the client call our method from elsewhere int eh code. We can do this in our submit form event:

    "submit form": function(event) {
      event.preventDefault();
      var playerNameVar = event.playerName.value;
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: 0,
        createdBy: currentUserId
      });
      Meteor.call("sendLogMessage");
    }

To get our app working again, we need to move the insert function form from the client to the server

This means that hte insert functino will secureily esxecute on teh server

users wont beable to insert data from teh console

    Meteor.methods({
      'insertPlayerData': function() {
        var currentUserId = Meteor.userId();
        PlayersList.insert({
          name: "David",
          score: 0,
          createdBy: currentUserId
        })
      }
    })

Then we go to the submit form event in th eclient and use Meteor.call

    "submit form": function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      Meteor.call("insertPlayerData");
    }

Based on tehse changes, the add player form will now kind of work. IF we ubmit it, we can see that we added david... and every time we add someone, we still add david. 
That's because we arent taking in anything from the clinent

____

Passing arguments

Modify the Meteor.call statement by passing throught eh playerNameVar as teh second argumenbt

    "submit form": function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      Meteor.call("insertPlayerData", playerNameVar);
    }

Because of this we are nw able to make our method accept this argument by passing playerNameVar between teh brackets of the method's function

    Meteor.methods({
      "insertPlayerData": function(playerNameVar){   -- this is where we are now passing in a variable, used as the second parameter in the Meteor.call
        var currentUserId = Meteor.userId();
        PlayerList.insert({
          name: playerNameVar,
          score: 0,
          createdBy: currentUserId
        })
      }
    })

Now we need to figure out how to let the logged in user to remove a player

    "click .remove": function() {
      var selectedPlayer = session.get("selectedPlayer");
      Meteor.call("removePlayerData", selectedPlayer)
    }

Then define removePlayerData in the Meteor.methods:

    "removePlayerData": function(selectedPlayer){
      PlayersList.remove(selectedPlayer);
    }

Now modifying scores

We have been using methods for security
we can also use them to reduce the amount of code in our apps

We will take the click .increment and click .decrement events and combine them into a single method

    "click .increment": function(){
      var selectedPlayer = Session.get("selectedPlayer");
      Meteor.call("modifyPlayerScore", selectedPlayer);
    }

We're passing "modify player score" with "selectedplayer"

in meteor methods:

    "modifyPlayerScore": function(selectedPlayer){
      PlayersList.update(selectedPlayer, {$inc: {score: 5}});
    }

We will now change it to accept two arguments: the seplected player and the amount to increment (-5 or +5)

    "modifyPlayerScore": function(selectedPlayer){
      PlayersList.update(selectedPlayer, {$inc: {score: scoreValue}});
    }

Then we want to set up the decrement function to pass two parameters into the modifyPlayerScore method.

    "click .decrement": function(){
      var selectedPlayer = Session.get("selectedPlayer");
      Meteor.call("modifyPlayerScore", selectedPlayer, -5);
    }

IF a javascript file lives in the client folder, you dont need the isClient conditional. same wit4h the server folder










