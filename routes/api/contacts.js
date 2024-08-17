const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  JoiSchema,
  JoiSchemaFavorite,
} = require("../../models/contacts.js");

const verifyToken = require("../../config/validateToken.js");

const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

router.get("/", async (req, res, next) => {
  const { page, limit, favorite } = req.query;
  try {
    const data = await listContacts(page, limit, favorite);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: "Bad requesttttt" });
  }
});

router.get("/:id", verifyToken, async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const data = await getContactById(contactId);
    const currentUserToken = req.user.token;
    if (req.tokenValidated === currentUserToken) {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } else {
      return res.status(404).json({ error: "token no longer in use" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const data = await removeContact(contactId);
    const currentUserToken = req.user.token;
    if (currentUserToken === req.tokenValidated) {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } else {
      return res.status(404).json({ error: "token no longer in use" });
    }
  } catch (error) {
    console.error("Error retrieving contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", verifyToken, async (req, res, __) => {
  try {
    const { error } = JoiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    } else {
      const newContact = {
        id: `${new Date().getTime()}`,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      };
      const data = await addContact(newContact);
      const currentUserToken = req.user.token;
      if (currentUserToken === req.tokenValidated) {
        if (data) {
          return res.status(200).json(data);
        } else {
          res.status(404).json({ error: "Contact not found" });
        }
      } else {
        return res.status(404).json({ error: "token no longer in use" });
      }
    }
  } catch (error) {
    return res.status(400).json({ error: "Bad request" });
  }
});

router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const { error } = JoiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    } else {
      const contactId = req.params.id;
      const data = await updateContact(contactId, req.body);
      const currentUserToken = req.user.token;
      if (req.tokenValidated === currentUserToken) {
        if (data) {
          return res.status(200).json(data);
        } else {
          res.status(404).json({ error: "Contact not found" });
        }
      } else {
        return res.status(404).json({ error: "token no longer in use" });
      }
    }
  } catch (error) {
    return res.status(404).json({ error: "Not found" });
  }
});

router.patch("/:id/favorite", verifyToken, async (req, res, __) => {
  try {
    const { error } = JoiSchemaFavorite.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing field favorite" });
    } else {
      const contactId = req.params.id;
      const data = await updateStatusContact(contactId, req.body);
      const currentUserToken = req.user.token;
      if (req.tokenValidated === currentUserToken) {
        if (data) {
          res.status(200).json(data);
        } else {
          res.status(404).json({ error: "Contact not found" });
        }
      } else {
        return res.status(404).json({ error: "token no longer in use" });
      }
    }
  } catch (error) {
    res.status(404).json({ error: "Not found" });
  }
});

module.exports = router;
