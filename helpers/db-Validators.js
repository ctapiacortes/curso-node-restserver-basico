const Role = require('../models/role')
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`)
    }
}

const emailExiste = async(correo = '') => {
    const existeMail = await Usuario.findOne({ correo });
    if (existeMail) {
        throw new Error(`El correo ${correo} ya está registrado`)
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe en la base de datos`)
    }
}

const existeCategoria = async(categoria = '') => {
    const existeCategoria = await Categoria.findById(categoria);
    if (!existeCategoria) {
        throw new Error(`La categoria ${categoria} no existe en la base de datos`)
    }
}

const existeProductoPorId = async(producto = '') => {
    const existeProducto = await Producto.findById(producto);
    if (!existeProducto) {
        throw new Error(`El producto ${producto} no existe en la base de datos`)
    }
}
module.exports = { esRolValido, emailExiste, existeUsuarioPorId, existeCategoria, existeProductoPorId }