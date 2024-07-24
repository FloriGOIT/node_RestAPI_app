const express = require("express");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  joiSchema,
} = require("../../models/contacts.js");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await listContacts();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: "Bad Request" });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const data = await getContactById(contactId);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: "Not Found" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const data = await removeContact(contactId);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: "Not Found" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const newId = {
      id: `${new Date().getTime()}`,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    const data = await addContact(newId);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: "Bad Request" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const contactId = req.params.contactId;
    const update = await updateContact(contactId, req.body);
    res.status(200).json(update);
  } catch (err) {
    res.status(404).json({ error: "Not found" });
  }
});

module.exports = router;
