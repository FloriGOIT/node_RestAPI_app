
const mongoose = require ("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');


const { Schema } = mongoose;

const ContactSchemaDB = new Schema({
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
      },

      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userdbs',
      }
})
ContactSchemaDB.plugin(mongoosePaginate)
const ContactDB = mongoose.model("ContactDB", ContactSchemaDB);

module.exports = ContactDB