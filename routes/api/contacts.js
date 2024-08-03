const {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
    JoiSchema,
    JoiSchemaFavorite,
    // JoiSchemaFavorite,

  } = require("../../models/contacts.js");

const express = require("express");
const ContactDb = require("../../models/contactsDb.js");
const router = express.Router();

router.get("/", async (_, res, __) => {
  try{ const data = await listContacts();
       res.status(200).json(data)}
  catch(error) {res.status(400).json({error: "Bad request"})}
})

router.get("/:id", async (req, res, __) => {
    try{const contactId = req.params.id;
        const data = await getContactById(contactId);
        res.status(200).json(data)}
    catch(error){res.status(404).json({error: "Not found"})}
})

router.delete("/:id", async (req, res, next) => {
    try{const contactId = req.params.id;
        const data = await removeContact(contactId);
        res.status(200).json(data)}
    catch(err){res.status(404).json({error: "Not found"})}
})

router.post("/", async(req, res, __) => {
    try{const {error} = JoiSchema.validate(req.body);
        if(error){return res.status(400).json({error: error.details[0].message})}
        else{const newContact = {id: `${new Date().getTime()}`, name: req.body.name, email: req.body.email, phone: req.body.phone }
            const data = await addContact(newContact);
            res.status(200).json(data)}}
    catch(error){res.status(400).json({error: "Bad request"})}
})
router.put("/:id", async (req, res, __) => {
    try{const {error} = JoiSchema.validate(req.body);
        if(error){return res.status(400).json({error: error.details[0].message})}
        const contactId = req.params.id;
        const data = await updateContact(contactId, req.body);
        res.status(200).json(data)
    }
    catch(error){res.status(404).json({error: "Not found"})}
})

/*
// am facut si cu scriere diferita in loc de "Dacă body nu există, se returnează un json cu cheia {"message": "missing field favorite"} și status code 400.""
router.patch("/:id/favorite", async (req, res) => {
    const contactId = req.params.id;
    const contact = await ContactDb.findById(contactId);
    if(!contact){return res.status(404).json({error: "Contact not found"})}
    else{
    try{
        const data = await updateStatusContact(contactId, {favorite: !contact.favorite})
        res.status(200).json(data)
    }
    catch(error){res.status(404).json({error: "Not found"})}}
    
})
*/

router.patch("/:id/favorite", async (req, res) => {
    const contactId = req.params.id;
    const contact = await ContactDb.findById(contactId);
    if(!contact){return res.status(404).json({error: "Contact not found"})}
    else{
        try{const {error} = JoiSchemaFavorite.validate(req.body);
            if(error){return res.status(400).json({"message": "missing field favorite"})}
            else{await updateStatusContact(contactId, {favorite: req.body.favorite})
            res.status(200).send("status updated")}}
    catch(error){res.status(404).json({error: "Not found"})}
}
})


module.exports = router