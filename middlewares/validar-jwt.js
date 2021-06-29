const { response } = require('express')
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay un token en la peticion al servidor'
        })
    }

    try {
        const { uid, ...payload } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        //leer el usuario que corresponde al uid
        //req.usuario = payload;
        //console.log(payload);
        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            res.status(400).json({
                msg: 'Token no valido - usuario no existe en db'
            })
        }

        //validar el estado del usaurio
        if (!usuario.estado) {
            res.status(400).json({
                msg: 'Token no valido - usuario con estado false'
            })
        }


        req.uid = uid;
        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: 'Token no valido'
        })

    }
}


module.exports = {
    validarJWT
}