const { Schema, model } = require('mongoose')

const rolesSchema = new Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio'],
    }
})

module.exports = model('Role', rolesSchema)