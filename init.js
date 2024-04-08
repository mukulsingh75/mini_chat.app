const mongoose = require("mongoose");
const Chat = require("./models/chat.js");



main()
  .then((res) => {
    console.log("connections successful");
  })
  .catch((err) => console.log(err));

async function main(){      //connection establish
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let chats = [
  {
    from: "mukul",
    to: "dheer",
    msg: "I will send you",
    created_at: new Date()
  },
  {
    from: "hamza",
    to: "niyaz",
    msg: "bring some comics for me",
    created_at: new Date()
  },
  {
    from: "virat",
    to: "harsh",
    msg: "lets party !",
    created_at: new Date()
  },
  {
    from: "roshan",
    to: "adam",
    msg: "give me money",
    created_at: new Date()
  }
];

Chat.insertMany(chats);
