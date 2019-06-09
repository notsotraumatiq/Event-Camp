const express = require("express");
const router = express.Router();
const eventData = require("../data/registerevent");
const userdata = require("../data/user");
var multer = require('multer');
var upload = multer({dest: './uploads'});
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.render("login");
});

router.get('/login', function(req, res, next) {
    res.render('login');
  });

router.post("/login", async (req, res) => {

    let searchData = await userdata.getAllUsers();

    try {
        if (req.session.uname) {
            res.redirect('/home');
        }
        else {
            let count = 0;
            if (req.body.uname === undefined || req.body.uname.length === 0) {
                throw "Username is incorrect or empty";
            } else if (req.body.password === undefined || req.body.password.length === 0) {
                throw "Password is incorrect or empty";
            } else {
                for (let i = 0; i < searchData.length; i++) {
                    if (req.body.uname === searchData[i].UserName) {
                        if(await bcrypt.compare(req.body.password, searchData[i].Password)){
                            count = 1;
                            req.session._id = searchData[i]._id;
                            req.session.uname = searchData[i].UserName;
                            req.session.password = searchData[i].Password;
                            req.session.FirstName = searchData[i].FirstName;
                            req.session.LastName = searchData[i].LastName;
                            req.session.DOB = searchData[i].DOB;
                            req.session.email = searchData[i].email;
                            req.session.PhoneNumber = searchData[i].PhoneNumber;
                        }
                        
                    }
                }
                if (count == 0) {
                    throw "Username and Password combination is incorrect";
                } else if (req.session.uname) {
                    res.redirect("/home");
                }
            }
        }

    } catch (error) {
        res.render('login',{err:error});
        //res.sendStatus(500).json({ error: e.toString() || 'Server Error', route: req.originalUrl });
    }
});

router.get('/home',async (req,res) =>{
    if(req.session.uname){
        try{
            let data = await eventData.getAllEvents();
            if (data.length == 0) {
                throw "No events Found";
            }
            res.render("home",{ data:data })
        }
        catch(error){
            res.render("home",{err:error})
        }
    }
    else{
        res.redirect('/login');
    }
});

router.get('/people/:id',async(req,res) => {
    if(req.session.uname){
        try{
            req.session.eventID = req.params.id;
            const data = await eventData.getEventById(req.params.id);
            const comment = await eventData.getCommentById(req.params.id);
            if (data.length == 0) {
                throw "No events Found";
            }
            req.session.EventName = data.EventName;
            res.render("eventdescription",{data:data,comment:comment});
        }
        catch(error){
            res.redirect('eventdescription',{err:error});
        }
    }
    else{
        res.redirect("/login");
    }
});

router.get('/event/:id',async(req,res) => {
    if(req.session.uname){
        try{
            req.session.eventID = req.params.id;
            const data = await eventData.getEventByName(req.params.id);
            if (data.length == 0) {
                throw "No events Found";
            }
            req.session.EventName = data.EventName;
            res.render("eventdescription",{data:data});
        }
        catch(error){
            res.redirect('eventdescription',{err:error});
        }
    }
    else{
        res.redirect("/login");
    }
});

router.post('/eventdetail',async(req,res) => {
    if(req.session.uname){
        const eventdetails = req.body;
        if( !eventdetails.comment || !req.session.uname  ){
            throw "Given information is not in proper format";
        }
        try{
            const newevent = await eventData.addCommenttoEvent(req.session.eventID,eventdetails.comment,req.session.uname);
            res.redirect('/home');
        } catch (e) {
            res.redirect('/home',{err:error});
        }
    }
    else{
        res.redirect('/login');
    }
});

router.get('/register', function(req, res, next) {
    res.render('userregistration');
});

router.get('/userevents', async(req,res) =>{
    if(req.session.uname){
        let data = await userdata.getEventdata(req.session.uname);
        //let event = await eventData.getEventNameById(data.EventName);
        res.render('userevents',{data:data});
    }
    else{
        res.redirect('/login');
    }
});

router.post('/rsvpuser',async(req,res) =>{
    if(req.session.uname){
        try{
            const newevent = await eventData.addRsvpToEvent(req.session.eventID,req.session.uname,req.session.EventName);
            const brownieEvent = await userdata.addBrownie(req.session.uname);
            res.redirect('/home');
        } catch (e) {
            res.redirect('/home',{err:error});
        }
    }
    else{
        res.redirect('/login');
    }
});

router.post('/register',async (req,res) => {
    const userdetails = req.body;
    //console.log(userdetails);
    try{
        if( !userdetails.fname || !userdetails.lname || !userdetails.email || !userdetails.uname || !userdetails.password || userdata.cpassword || userdata.dob || userdata.pnumber){
            throw "Information is missing. Please fill all details";
        }
        if(!(userdetails.password == userdetails.cpassword)){
            throw "password do not match";
        }

        let searchData = await userdata.getUnameUser(userdetails.uname);
  
        if(searchData){
            throw "User Name already exist. Try New User Name";
        }

        let emailData = await userdata.getEmailUser(userdetails.email);
        if(emailData){
            throw "Email ID already registerd. Try New Email ID";
        }

        let phoneData = await userdata.getPnumUser(userdetails.pnumber);
        if(phoneData){
            throw "Phone number already registered. Try New Phone Number";
        }

        const {fname, lname, email,uname,password,dob,pnumber} = userdetails;
        const newpost = await userdata.addUser(uname,password,fname,lname,dob,email,pnumber);
        res.redirect('/login');
    } catch (error) {
        res.render('userregistration',{err:error})
    }
});

router.get('/userprofile',async(req,res) => {
    if(req.session.uname){
        const data = await userdata.getUserById(req.session._id);
        const brownie = await userdata.getBrownie(req.session.uname);
        console.log(data);
        res.render('userprofile',{data:data,brownie:brownie});
    }
    else{
        res.redirect('/login');
    }
});

router.post('/updateUser',async(req,res) => {
    if(req.session.uname){
        try{
            const userdetails = req.body;
            if( !userdetails.fname || !userdetails.lname || !userdetails.email ||  userdata.dob || userdata.pnumber){
                throw "Given information is not in proper format";
            }
    
            const {fname, lname, email,uname,dob,pnumber} = userdetails
            const newpost = await userdata.updateUser(req.session.uname,req.session.password,fname,lname,dob,email,pnumber);
            res.redirect('/home');
         } catch (error) {
            res.render('userprofile',{err:error})
        }
    }   
    else{
        res.redirect('/login');
    }
});

router.get('/uservolunteering',async(req,res) => {
    if(req.session.uname){
        let data = await userdata.getrsvp(req.session.uname);
        res.render('uservolunteering',{data:data});
    }
    else{
        res.redirect('/login')
    }
});

router.get('/addevent',async(req,res) =>{
    if(req.session.uname){
        res.render('eventregistration');
    }
    else{
        res.redirect('/login');
    }
});

router.post('/eventregistration', async(req,res) =>{    
    if(req.session.uname){
        try{
            const eventdetails = req.body;

            if( !eventdetails.EventName || !eventdetails.Description || !eventdetails.Location || !eventdetails.Category || !eventdetails.DateofEvent){
                throw "Please fill all the details";
            }
    
            const {EventName, Description, Location,Category,DateofEvent} = eventdetails
            const newpost = await eventData.addEvent(EventName, Description, Location,Category,DateofEvent,req.session.uname);
            res.redirect('/home');
        } 
        catch (error) {
            res.render('eventregistration',{err:error});
        }
    }
    else{
        res.redirect('/login');
    }
});

router.get('/logout',async(req,res) => {
    if(req.session.uname){
        req.session.destroy();
        res.redirect('/login')    
    }
    else{
        res.redirect('/login');
    }
})

module.exports = router;
    