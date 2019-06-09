const mongoCollections = require("./mongocollections");
const events = mongoCollections.events;
const comments = mongoCollections.comments;
const rsvps = mongoCollections.rsvps;

const exportedMethods = {

  async getAllEvents() {
    const eventCollection = await events();
    const event = await eventCollection.find({}).toArray();
    return event
  },

  async getEventById(id) {
    ObjectId = require('mongodb').ObjectID;
    if(!id){
      throw "You must insert id"
    }
    const eventCollection = await events();
    const Event = await eventCollection.findOne({ _id: ObjectId(id) });
    //console.log(Event);
    if (Event === null) throw "No event with that id";
    return Event;
  },

  async getCommentById(id) {
    ObjectId = require('mongodb').ObjectID;
    if(!id){
      throw "You must insert id"
    }
    const commentCollection = await comments();
    const Comment = await commentCollection.find({ EventId: id }).toArray();
    if (Comment === null) throw "No event with that id";
    return Comment;
  },

  async addCommenttoEvent(Eventid,comment,UserName){
    ObjectId = require('mongodb').ObjectID;

    const commentCollection = await comments();

    const newComment = {
      EventId: Eventid,
      comment: comment,
      UserName: UserName
    };

    
    return commentCollection
    .insertOne(newComment)
    .then(newInsertInformation => {
      return newInsertInformation.insertedId;
    }).then(newId => {
      return this.getCommentById(newId);
    });

  },

  async addRsvpToEvent(Eventid,username,EventName){
    const rsvpcollection = await rsvps();

    const newRSVP = {
      EventId:Eventid,
      UserName: username,
      EventName:EventName
    };

    return rsvpcollection
    .insertOne(newRSVP)
    .then(newInsertInformation => {
      return newInsertInformation.insertedId;
    });

  },

  async getCommentbyEvent(id){
    ObjectId = require('mongodb').ObjectID;
    if(!id){
      throw "You must insert id"
    }
    const commentCollection = await comment();
    const Comment = await commentCollection.find({ EventId: ObjectId(id) });
    //console.log(Event);
    if (Comment === null) throw "No event with that id";
    return Comment;
  },

  async addEvent(EventName, Description, Location,Category,DateofEvent,uname) {
        if (typeof EventName !== "string" || !EventName) throw "No Event Name provided or incorrect type";
        if (typeof Description !== "string" || !Description) throw "No Description provided or not of proper type";
        if (typeof Location !== "string" || !Location) throw "No Location provided or not of proper type";
        if (typeof Category !== "string" || !Category) throw "No Category provided or not of proper type";
        if (typeof DateofEvent !== "string" || !DateofEvent) throw "No DateofEvent provided or not of proper type";
        ObjectId = require('mongodb').ObjectID;
    
        const newEvent = {
          EventName: EventName,
          Description: Description,
          Location: Location,
          Category: Category,
          DateofEvent:DateofEvent,
          UserName:uname
        };
        
        const eventCollection = await events();

      return eventCollection
        .insertOne(newEvent)
        .then(newInsertInformation => {
          return newInsertInformation.insertedId;
        })
        .then(newId => {
          return this.getEventById(newId);
        });
        
  },

  async getEventNameById(Eventname){
    if(!Eventname){
      throw "You must insert Eventname"
    }
    const eventCollection = await events();
    const Event = await eventCollection.findOne({ EventName: Eventname });
    //console.log(Event);
    if (Event === null) throw "No event with that id";
    return Event;
  },

  async getEventByName(Eventname){
    if(!Eventname){
      throw "You must insert Eventname"
    }
    const eventCollection = await events();
    const Event = await eventCollection.findOne({ EventName: Eventname });
    //console.log(Event);
    if (Event === null) throw "No event with that id";
    return Event;
  }

}

module.exports = exportedMethods;