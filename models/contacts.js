const ContactDb = require("./contactsDb")
// const fs = require("fs").promises;
// const path = require("path");
// const dataFile = path.join(__dirname, "contacts.json");
const Joi = require("joi");


const JoiSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean().default(false)
})
const JoiSchemaFavorite = Joi.object({
    favorite: Joi.boolean().required()
})


const listContacts = async () => {
    // return JSON.parse(data)
    const data = await ContactDb.find({});
    return data;
}

const getContactById = async (contactId) => {
    // const data =  await fs.readFile(dataFile, "utf-8");
    // const dataParse = JSON.parse(data);
    // const dataById = dataParse.filter(data => data.id === contactId);
    // return dataById;

    const data = await ContactDb.findById(contactId);
    return data
}

const removeContact = async (contactId) => {
   // const data = await fs.readFile(dataFile, "utf-8");
   // const dataParse = JSON.parse(data);
   // const dataByIdBoolean = dataParse.some(data => data.id === contactId);
   // if(dataByIdBoolean){const dataById = dataParse.filter(data => data.id === contactId)
                       // const dataByIdDel = dataParse.filter(data => data.id !== contactId)
                       // await fs.writeFile(dataFile, JSON.stringify(dataByIdDel, null, 2), "utf-8");
                       // return dataById}
   // else{throw new Error("Data not found")}
   const data = await ContactDb.findByIdAndDelete(contactId);
   return data
}


const addContact = async (newContact) => {
    // const data = await fs.readFile(dataFile, "utf-8");
    // const dataParse = JSON.parse(data);
    // dataParse.push(newContact);
    // await fs.writeFile(dataFile, JSON.stringify(dataParse, null, 2), "utf-8");
    const data = await ContactDb.create(newContact);
    return data;
}

const updateContact =  async (contactId, body) => {
    // const dataParse = JSON.parse(data);
    // const identifyContact = dataParse.findIndex(data => data.id === contactId);
    // const data = await fs.readFile(dataFile, "utf-8");
    // if(identifyContact === -1){throw new Error("Contact not found")}
    // else{dataParse[identifyContact] = {id: contactId, ...body };}
    // await fs.writeFile(dataFile, JSON.stringify(dataParse, null, 2), "utf-8");
    // return dataParse[identifyContact];
    const data = await ContactDb.findByIdAndUpdate(contactId, body, { new: true })
    return data
}
 
const updateStatusContact = async (contactId, body) => {
    const data = await ContactDb.findByIdAndUpdate(contactId, body, { new: true })
    return data
}





module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
    JoiSchema,
    JoiSchemaFavorite
  };


