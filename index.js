const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");


app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"public")));

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");



main()
  .then((res) => {
    console.log(res);
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

app.get("/chats", async (req,res)=>{
    let chats = await Chat.find();
    // console.log(chats);
    res.render("index.ejs",{chats});
})

    // new route

app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})

   //create route

app.post("/chats",(req,res)=>{
    let{from,msg,to} = req.body;
    let newChat = new Chat({
        from:from,
        to:to,
        msg:msg,
        created_at : new Date()
    });
    newChat.save().then((res)=>{
        console.log("chat saved");
    })
    .catch((err)=>{
        console.log(err);
    })
    res.redirect("/chats");

})

      //edit route

app.get("/chats/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs",{chat});
})  

       //update route

app.put("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let { msg:newmsg } = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(
    id,
    { msg: newmsg,updated_at:new Date() },
    { runValidators: true, new: true }
  );
  console.log(updatedChat);
  res.redirect("/chats");
});     


       //delete button

app.delete("/chats/:id/delete",async(req,res)=>{
    let {id} = req.params;
    let delChat = await Chat.findByIdAndDelete(id);
    console.log(delChat);
    res.redirect("/chats");
})       

app.get("/",(req,res)=>{
    res.send("Working");
})


app.listen(8080,()=>{
    console.log("app is listening on port 8080");
})