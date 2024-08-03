
const mongoose = require("mongoose");
const host = "mongodb+srv://florivachente:Pr0gr1m1t01r3@clusterflorentinavachen.wvt36rz.mongodb.net/";

mongoose.connect(host, {useNewUrlParser: true, useUnifiedTopology: true} )
 .then(() => console.log("Database connection successful"))
 .catch( err => {console.log("Could not connect to Database", err);
                 process.exit(1)}) 
 const { Schema } = mongoose;
 const ContactSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Set name for contact'],
    minLength: 3,
    maxLength: 50,
},
email: { 
  type: String, 
  required: true,
  minLength: 3,
  maxLength: 50,
},
phone: { 
  type: String, 
  required: true,
  minLength: 7,
  maxLength: 20},

favorite: {
    type: Boolean, 
    default: false
  }

 });
 
 const ContactDb = mongoose.model("contactDb", ContactSchema)
 module.exports = ContactDb;