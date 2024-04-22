const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");


app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"public")));

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");



main()
  .then((res) => {
    console.log("connection establish");
  })
  .catch((err) => console.log(err));

async function main(){      //connection establish
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

// let chat1 = new Chat({
//     from:"mukul",
//     to:"dheer",
//     msg:"send me notes",
//     created_at: new Date()
// });

// chat1.save().then((res)=>{
//     console.log("Data saved");
// })
// .catch((err)=>{
//     console.log("error !");
// });


   // get route

app.get("/chats", asyncWrap( async (req,res,err)=>{    //here using async wrap
        let chats = await Chat.find();
    // console.log(chats);
    res.render("index.ejs",{chats});
}
));

    // new route

app.get("/chats/new",(req,res)=>{
    // throw new ExpressError(404,"page not found");
    res.render("new.ejs");
})

   //create route

app.post("/chats",asyncWrap(async (req, res, next) => {
    let { from, msg, to } = req.body;
    let newChat = new Chat({
      from: from,
      to: to,
      msg: msg,
      created_at: new Date()
    });
    await newChat.save();
    res.redirect("/chats");
  })
);

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err) => next(err));
    }
}

     //show route

app.get("/chats/:id",asyncWrap(async(req,res,next)=>{
        let {id} = req.params;
        let chat = await Chat.findById(id);
        if(!chat){
            next(new ExpressError(500,"chat not found")) ;
        }
        res.render("edit.ejs",{chat});
    }
));     

      //edit route

app.get("/chats/:id/edit",asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  })
);  

       //update route

app.put("/chats/:id", asyncWrap(async (req, res,next) => {
    let { id } = req.params;
    let { msg: newmsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      id,
      { msg: newmsg, updated_at: new Date() },
      { runValidators: true, new: true }
    );
    console.log(updatedChat);
    res.redirect("/chats"); 
})
);     


       //delete button

app.delete("/chats/:id/delete", asyncWrap(async (req, res, err) => {
    let { id } = req.params;
    let delChat = await Chat.findByIdAndDelete(id);
    console.log(delChat);
    res.redirect("/chats");
  })
);       

app.get("/",(req,res)=>{
    res.send("Working");
})

const handleValidationErr = (err)=>{
    console.log("This was a Validation error. Please follow rules");
    console.dir(err.message);
    return err;
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === 'ValidationError'){
        handleValidationErr(err);
    }
    next(err);

})

//error handling middleware

app.use((err,req,res,next)=>{
    let {status=500,message="some error occured"} = err;
    res.status(status).send(message);
})


app.listen(8080,()=>{
    console.log("app is listening on port 8080");
})