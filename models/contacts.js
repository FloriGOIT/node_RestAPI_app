const ContactDB = require("./contactsDb.js");
const Joi = require("joi");

const JoiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().default(false),
});

const JoiSchemaFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

const listContacts = async (page = 1, limit = 5, favorite = "true") => {
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { favorite: favorite === "true" ? -1 : 1 },
  };
  try {
    const contacts = await ContactDB.paginate({}, options);
    return contacts;
  } catch (error) {
    throw new Error("Error fetching contacts");
  }
};

const getContactById = async (contactId) => {
  const data = await ContactDB.findById(contactId);
  return data;
};

const removeContact = async (contactId) => {
  const data = await ContactDB.findByIdAndDelete(contactId);
  return data;
};

const addContact = async (newContact) => {
  const data = await ContactDB.create(newContact);
  return data;
};

const updateContact = async (contactId, body) => {
  const data = await ContactDB.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return data;
};

const updateStatusContact = async (contactId, body) => {
  const data = await ContactDB.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return data;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  JoiSchema,
  JoiSchemaFavorite,
};
