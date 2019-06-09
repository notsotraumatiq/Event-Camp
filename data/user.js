const mongoCollections = require("./mongocollections");
const users = mongoCollections.users;
const rsvps = mongoCollections.rsvps;
const events = mongoCollections.events;
const brownies = mongoCollections.brownies;
const bcrypt = require('bcrypt');
const exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
        const user = await userCollection.find({}).toArray();
        return user;
    },

    async getrsvp(uname){ 
      if(!uname){
        throw "user name must be provided";
      }
      const rsvpcollection = await rsvps();
      const rsvp = await rsvpcollection.find({UserName:uname}).toArray();
      if(rsvp == null) throw "User has no volunteering coming up";
      return rsvp;
    },

    async getUserById(id) {
        ObjectId = require('mongodb').ObjectID;
        if(!id){
            throw "You must insert id"
        }
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: ObjectId(id) });
        if (user === null) throw "No user with that id";
        return user;
    },

    async updateUser(UserName, Password, FirstName,LastName,DOB,email,PhoneNumber){
      if (typeof UserName !== "string" || !UserName) throw "No UserName provided or incorrect type";
      if (typeof Password !== "string" || !Password) throw "No Password provided or not of proper type";
      if (typeof FirstName !== "string" || !FirstName) throw "No FirstName provided or not of proper type";
      if (typeof LastName !== "string" || !LastName) throw "No LastName provided or not of proper type";
      if (typeof DOB !== "string" || !DOB) throw "No DateofEvent provided or not of proper type";
      if (typeof email !== "string" || !email) throw "No email provided or not of proper type";
      if (typeof PhoneNumber !== "string" || !PhoneNumber) throw "No PhoneNumber provided or not of proper type";
      ObjectId = require('mongodb').ObjectID;

      const newUser = {
        UserName: UserName,
        Password: Password,
        FirstName: FirstName,
        LastName: LastName,
        DOB:DOB,
        email:email,
        PhoneNumber:PhoneNumber
      };

      const userCollection = await users();

      const updateuser = await userCollection.replaceOne(
        { UserName: UserName },
        newUser
       );
       
        if (updateuser.modifiedCount === 0) {
          throw "could not update animal successfully";
        }


    },

    async generatePassword(){
      
    },
    async addUser(UserName, Password, FirstName,LastName,DOB,email,PhoneNumber) {
        if (typeof UserName !== "string" || !UserName) throw "No UserName provided or incorrect type";
        if (typeof Password !== "string" || !Password) throw "No Password provided or not of proper type";
        if (typeof FirstName !== "string" || !FirstName) throw "No FirstName provided or not of proper type";
        if (typeof LastName !== "string" || !LastName) throw "No LastName provided or not of proper type";
        if (typeof DOB !== "string" || !DOB) throw "No DateofEvent provided or not of proper type";
        if (typeof email !== "string" || !email) throw "No email provided or not of proper type";
        if (typeof PhoneNumber !== "string" || !PhoneNumber) throw "No PhoneNumber provided or not of proper type";
        ObjectId = require('mongodb').ObjectID;
        let hPassword = bcrypt.hashSync(Password,10);
        console.log("hPassword: ",hPassword);

        const newUser = {
          UserName: UserName,
          Password: hPassword,
          FirstName: FirstName,
          LastName: LastName,
          DOB:DOB,
          email:email,
          PhoneNumber:PhoneNumber
        };
        
        const userCollection = await users();

      return userCollection
        .insertOne(newUser)
        .then(newInsertInformation => {
          return newInsertInformation.insertedId;
        })
        .then(newId => {
          return this.getUserById(newId);
        });
        
    },

    async getEventdata(uname){
      if(!uname){
        throw "user name must be provided";
      }
      const eventdata = await events();
      const event = await eventdata.find({UserName:uname}).toArray();
      if(event == null) throw "User has not hosted any events";
      return event;
    },

    async getUnameUser(uname){
      if(!uname){
        throw "You must insert User Name"
      }
      let userCollection = await users();
      let user = await userCollection.findOne({ UserName: uname });
      return user;
    },

    async getEmailUser(email){
      if(!email){
        throw "You must insert email id"
      }
      let userCollection = await users();
      let user = await userCollection.findOne({ email: email });
      return user;
    },

    async getPnumUser(pnumber){
      if(!pnumber){
        throw "You must insert phone number"
      }
      const userCollection = await users();
      const user = await userCollection.findOne({ PhoneNumber: pnumber });
      return user;
    },

    async addBrownie(uname){
      if(!uname){
        throw "You must insert User Name"
      }
      const brownieCollection = await brownies();
      const brownieData = await brownieCollection.findOne({UserName:uname})
      if(brownieData){
        const newBrownie = {
          UserName: uname,
          Brownie: (brownieData.Brownie + 1)
        };
      
        const updatebrownie = await brownieCollection.replaceOne(
          { UserName: uname },
            newBrownie
          );

          if (updatebrownie.modifiedCount === 0) {
            throw "could not update animal successfully";
          }
      }
      else{
        const newBrownie = {
          UserName: uname,
          Brownie: 1
        };
        return brownieCollection
        .insertOne(newBrownie)
        .then(newInsertInformation => {
          return newInsertInformation.insertedId;
        })
      }
    },

    async getBrownie(uname){
      if(!uname){
        throw "You must insert User Name"
      }
      let brownieCollection = await brownies();
      let brownie = await brownieCollection.findOne({ UserName: uname });
      return brownie;
    }
}

module.exports = exportedMethods;