const fs = require("fs").promises;
const path = require("path");
const dataFile = path.join(__dirname, "contacts.json");
const Joi = require("joi");

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const listContacts = async () => {
  const data = await fs.readFile(dataFile, "utf-8");
  const dataParse = JSON.parse(data);
  return dataParse;
};

const getContactById = async (contactId) => {
  const data = await listContacts();
  const contactSearch = data.filter((el) => el.id === contactId);
  return contactSearch;
};

const removeContact = async (contactId) => {
  const data = await listContacts();
  const contactstoKeep = data.filter((el) => el.id !== contactId);
  const contactToDelete = data.filter((el) => el.id === contactId);
  await fs.writeFile(
    dataFile,
    JSON.stringify(contactstoKeep, null, 2),
    "utf-8"
  );
  return contactToDelete;
};

const addContact = async (newId) => {
  const data = await listContacts();
  data.push(newId);
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8");
  return newId;
};

const updateContact = async (contactId, body) => {
  const data = await listContacts();
  const selectedData = data.findIndex((el) => el.id === contactId);
  if (selectedData === -1) {
    throw new Error("Contact not found");
  } else {
    data[selectedData] = { id: contactId, ...body };
  }
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8");
  return data[selectedData];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  joiSchema,
};