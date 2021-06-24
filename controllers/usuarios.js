const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { emailExiste } = require('../helpers/db-Validators');


const usuariosGet = async(req = request, res = response) => {

    //const params = req.query
    //const { cliente = 'Cristian'} = req.query
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPut = async(req, res) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos
    if (password) {
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioDB = await Usuario.findByIdAndUpdate(id, resto)

    res.json(usuarioDB)
}

const usuariosPost = async(req, res) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en BD
    await usuario.save();


    res.json({
        msg: 'Usuario Ingresado Correctamente',
        usuario
    })
}

const usuariosDelete = async(req = request, res = response) => {
    const { id } = req.params;

    //Borrar fisicamente un registro

    //const usuario = await Usuario.findByIdAndDelete(id);
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false })

    res.json({
        msg: 'delete API - controlador',
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}