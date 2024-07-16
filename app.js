
const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

const dataFile = path.join(__dirname, "contacts.json")
app.use(express.urlencoded({extended : false})); // middleware
app.use(express.json()) // serializare
app.get("/", async (req, res) => {res.json("Helloooo!!!")})
app.listen(PORT, () => {console.log("Server is UP on port 3000.")})


/*
const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const contactsRouter = require('./routes/api/contacts')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

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
*/
