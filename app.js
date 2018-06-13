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
var Image    = require("./models/image");
 var cloudinary = require('cloudinary');
  var multer = require('multer'); 

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
      Image.find({},function(err,images){
    if (err) {
      console.log(err);
    } else {
      var imagesLength = images.length;
      res.render('home',{images:images,imagesLength:imagesLength});
        }
  })
});




//=================================================resume route==============================================//

app.get("/resume",function(req,res){
  Image.find({},function(err,images){
    if (err) {
      console.log(err);
    } else {
      var imagesLength = images.length;
      res.render('resume',{images:images,imagesLength:imagesLength});
        }
  })
});


//========================================upload image==================//

app.get("/imageUpload",function(req,res){
  res.render("image");
});



 var upload = multer({ dest: './uploads/'});

 app.post('/imageUpload', upload.single('file'), function(req,res){
   
 
    cloudinary.uploader.upload(req.file.path,
    function(result){
      
      var ProfileImage = {
        ProfileImage:result.secure_url
      }
      
      Image.create(ProfileImage,function(err,image){
        if (err) {
          console.log(err)
        } else {
          res.redirect("/");
        }
      })

     

    })
 })


//===================================================publication====================================================================//



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

//=======================================publication show===========================================================//

app.get("/resume/publication/:id",function(req, res){
  Publication.findById(req.params.id,function(err,foundPublication){
      if(err){
    console.log(err)
} else{
  res.render("publicationShow",{publication:foundPublication});
  
}});
});

//==========================================================delete publicationroutes====================================//

app.delete("/resume/publication/:id",function(req,res){
  Publication.findByIdAndRemove(req.params.id, function(err){
     if(err){
    console.log(err)
} else{
  res.redirect("/resume/publication");
  }
   });
});



//================================================CONTRIBUTION======================================================================//



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

//=======================================contribution show===========================================================//

app.get("/resume/contribution/:id",function(req, res){
  Contribution.findById(req.params.id,function(err,foundContributions){
      if(err){
    console.log(err)
} else{
  res.render("contributionShow",{contribution:foundContributions});
  
}});
});

//==========================================================delete routes=======================================//

app.delete("/resume/contribution/:id",function(req,res){
  Contribution.findByIdAndRemove(req.params.id, function(err){
     if(err){
    console.log(err)
} else{
  res.redirect("/resume/contribution");
  }
   });
});



//================================================workshop=========================================================================//



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


//=======================================workshop show===========================================================//

app.get("/resume/workshop/:id",function(req, res){
  Workshop.findById(req.params.id,function(err,foundWorkshop){
      if(err){
    console.log(err)
} else{
  res.render("workshopShow",{workshop:foundWorkshop});
  
}});
});

//==========================================================delete workshop=======================================//

app.delete("/resume/workshop/:id",function(req,res){
  Workshop.findByIdAndRemove(req.params.id, function(err){
     if(err){
    console.log(err)
} else{
  res.redirect("/resume/workshop");
  }
   });
});




//================================================membership========================================================================//


app.get("/skills",function(req,res){
  Image.find({},function(err,images){
    if (err) {
      console.log(err);
    } else {
      var imagesLength = images.length;
      res.render('skills',{images:images,imagesLength:imagesLength});
        }
  })
});



app.get("/skills/membership", function(req, res) {
  Membership.find({},function(err, memberships){
    if(err){
      console.log(err)
    } else{
      res.render("membership",{memberships:memberships}); 
    }
  });
});



//==================================================new membership================================================//

app.post("/skills/membership",function(req,res){
  var membership = { membership:req.body.membership}
  Membership.create(membership ,function(err,newMembership){
    if(err){
      console.log(err);
    } else{
      res.redirect("/skills/membership");
    }
  });
});


app.get("/skills/membership/new",function(req,res){
  res.render("newMembership");
});

//=======================================membership show===========================================================//

app.get("/skills/membership/:id",function(req, res){
  Membership.findById(req.params.id,function(err,foundMembership){
      if(err){
    console.log(err)
} else{
  res.render("membershipShow",{membership:foundMembership});
  
}});
});

//==========================================================delete membership=======================================//

app.delete("/skills/membership/:id",function(req,res){
  Membership.findByIdAndRemove(req.params.id, function(err){
     if(err){
    console.log(err)
} else{
  res.redirect("/skills/membership");
  }
   });
});






//================================================work===============================================//



app.get("/skills/work", function(req, res) {
 
      res.render("work"); 
 
});





//=======================================================Contact====================================================================//


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
  Image.find({},function(err,images){
    if (err) {
      console.log(err);
    } else {
      var imagesLength = images.length;
      res.render('contact',{images:images,imagesLength:imagesLength});
        }
  })
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
    res.redirect("/");
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
