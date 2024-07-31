const express = require('express')
const logger = require('morgan')
const cors = require('cors')


const contactsRouter = require('./routes/api/contacts')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

// Mongoose
const mongoose = require("mongoose");
const host = "mongodb+srv://florivachente:Pr0gr1m1t01r3@clusterflorentinavachen.wvt36rz.mongodb.net/";

mongoose.connect(host, {useNewUrlParser: true, useUnifiedTopology: true} )
 .then(() => console.log("Database connection successful"))
 .catch( err => {console.log("Could not connect to Database", err);
                 process.exit(1)}) 
 const MongoSchema = mongoose.Schema;
 const ContactSchema = new MongoSchema({
  name: { 
    type: String, 
    require: true,
    unique: true,
    minLength: 3,
    maxLength: 50,
},
email: { 
  type: String, 
  require: true,
  unique: true,
  minLength: 3,
  maxLength: 50,
},
phone: { 
  type: String, 
  require: true,
  unique: true,
  minLength: 7,
  maxLength: 20,
}
 });
 
 const contactDb = mongoose.model("contactDb", ContactSchema)
 module.export = contactDb


                 

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
