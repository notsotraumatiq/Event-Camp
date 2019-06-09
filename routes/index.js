const eventRoute = require("./eventregistration");
const bodyParser = require("body-parser");
const session= require("express-session");
const path= require("path");
const cookieparser= require("cookie-parser");

const constructorMethod = app => {

  app.use(cookieparser());
    app.use(bodyParser.json());
    app.use(session({

        name: 'AuthCookie',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: true        
    }));

    app.use((req,res,next) =>{
        console.log("Current Timestamp", new Date().toUTCString());
        console.log("Request Method:", req.method);
        console.log("Request Route:", req.originalUrl);
        if(!req.session.username){
            //console.log("["+new Date().toUTCString()+"]: "+req.method+" / (Non-Authenticated User)");
        }else{
            //console.log("["+new Date().toUTCString()+"]: "+req.method+" / (Authenticated User)");
        }
        next();
    });

  app.use(bodyParser.json());

  app.use("/", eventRoute);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

module.exports = constructorMethod;
