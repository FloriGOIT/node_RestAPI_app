



const express =  require("express");
const app = express();
const colors = require("colors");
const PORT = 3000;
app.use(express.urlencoded({extended:false}));
app.use(express.json());
console.log("Eschal is from Ecart".green)

const ITEMS = [
                {id: "1", item:"i am here"},
                {id: "2", item:"let it be your will God, shelp me understand the LIGHT path"}
              ]
console.log(ITEMS)              
app.get("/",async (req, res) => {res.json("continuing...")})




app.get("/items", async (req, res) =>
           {
            try{res.json(ITEMS)}
            catch(err){res.status(500).json({error: "Server internal error."})}
           } 
       )
// "I have my intention here"
app.post("/items", async (req, res) =>
           {
            try{const newI = {id: new Date(), item: req.body.title};
                ITEMS.push(newI);
                res.json(newI)}
            catch(err){res.status(500).json({error: "Server internal error."})}
           }
        )

app.get("/items/:id",async (req, res) => {
    try {
        const idItem = req.params.id;
        res.json({ id: `${idItem}` });
    } catch (err) {
        res.status(500).json({ error: "Server internal error." });
    }
});

app.listen(PORT, () => {console.log("Server is up".blue)})




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
