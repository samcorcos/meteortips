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

Now we're modifyting the function to 
