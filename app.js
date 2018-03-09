var express           = require('express');
var app               = express();
var bodyParser        = require('body-parser');
var mongoose          = require('mongoose');
var passport          = require('passport');
var LocalStrategy     = require('passport-local');
var methodOverride    = require('method-override');
var flash             = require('connect-flash');
var User              = require("./models/user");
var Publication       = require("./models/publication");
var Contribution      = require("./models/contribution");
var Workshop          = require("./models/workshop");
var Contact           = require("./models/contact");
var Membership        = require("./models/membership");

mongoose.connect("mongodb://localhost/portfolio", {
  useMongoClient: true
});
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));


//================================================PASSPORT CONFIGURATION==================================================//


app.use(require("express-session")({
  secret:"THIS IS SECRET",
  resave:false,
  saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/////passing "currentUser" to every template/////////////////
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.message = req.flash("error");
  next();
});


//====================================================home rout==========================================///


app.get("/",function(req,res){
  res.render("home");
});

//=================================================resume route==============================================//

app.get("/resume",function(req,res){
  res.render("resume");
});



//===================================================publication=================================================//



app.get("/resume/publication", function(req, res) {
  Publication.find({},function(err, publications){
    if(err){
      console.log(err)
    } else{
      res.render("publication",{publications:publications}); 
    }
  });
});


//==================================================new publication================================================//



app.get("/resume/publication/new",function(req,res){
  res.render("newPublication");
});


app.post("/resume/publication",function(req,res){
  var description = { description:req.body.description}
  Publication.create(description ,function(err,newPublication){
    if(err){
      console.log(err);
    } else{
      res.redirect("/resume/publication");
    }
  });
});

//================================================contribution===================================================//



app.get("/resume/contribution", function(req, res) {
  Contribution.find({},function(err, contributions){
    if(err){
      console.log(err)
    } else{
      res.render("contribution",{contributions:contributions}); 
    }
  });
});


//==================================================new contribution================================================//



app.get("/resume/contribution/new",function(req,res){
  res.render("newContribution");
});


app.post("/resume/contribution",function(req,res){
  var contribution = { contribution:req.body.contribution}
  Contribution.create(contribution ,function(err,newContribution){
    if(err){
      console.log(err);
    } else{
      res.redirect("/resume/contribution");
    }
  });
});


//================================================workshop===================================================//



app.get("/resume/workshop", function(req, res) {
  Workshop.find({},function(err, workshops){
    if(err){
      console.log(err)
    } else{
      res.render("workshop",{workshops:workshops}); 
    }
  });
});



//==================================================new workshop================================================//

app.post("/resume/workshop",function(req,res){
  var workshop = { workshop:req.body.workshop}
  Workshop.create(workshop ,function(err,newWorkshop){
    if(err){
      console.log(err);
    } else{
      res.redirect("/resume/workshop");
    }
  });
});


app.get("/resume/workshop/new",function(req,res){
  res.render("newWorkshop");
});


//=======================================================Contact=============================================//


app.get("/contected", function(req, res) {
  Contact.find({},function(err, contacts){
    if(err){
      console.log(err)
    } else{
      res.render("newContacts",{contacts:contacts}); 
    }
  });
});



app.post("/contact",function(req,res){
  var contact = { 
                  name:req.body.Name,
                  email:req.body.email,
                  message:req.body.message
                }
  Contact.create(contact ,function(err,newContact){
    if(err){
      console.log(err);
    } else{
      res.redirect("/contact");
    }
  });
});


app.get("/contact",function(req,res){
  res.render("contact")
});






//================================================membership===================================================//



app.get("/membership", function(req, res) {
  Membership.find({},function(err, memberships){
    if(err){
      console.log(err)
    } else{
      res.render("membership",{memberships:memberships}); 
    }
  });
});



//==================================================new membership================================================//

app.post("/membership",function(req,res){
  var membership = { membership:req.body.membership}
  Membership.create(membership ,function(err,newMembership){
    if(err){
      console.log(err);
    } else{
      res.redirect("/membership");
    }
  });
});


app.get("/membership/new",function(req,res){
  res.render("newMembership");
});










//==============================================================signup route================================================//

app.get("/register", function(req, res){
  res.render("register");
});




app.post("/register",function(req,res){
  var newUser = new User({username:req.body.username});
  var password = req.body.password; 
  User.register(newUser, password, function(err, user){
    if(err){
      console.log(err);
//       return res.render("ca/register");
    } else{
       passport.authenticate("local")(req, res, function(){
       res.redirect("/");
    });
    }
  });
});


// //==============================================================login route================================================//

app.get("/login",function(req, res){
  res.render("login");
});


app.post("/login", passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login"
}), function(req,res){
});

//==============================================================logout route================================================//

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
});

//==============================================================middleware================================================//

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect("/login");
  }
}




app.listen(3000, function () {
  console.log('Server started at port 3000');
});