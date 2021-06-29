const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos'
            })
        }

        //Verificar si el usuario está activo en la bd
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos - estado: falso'
            })
        }

        //Validar la contraseña
        const validPassword = await bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos - estado: contraseña equivocada'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.json({
            msg: 'Algo salio mal'
        });

    }


}


module.exports = { login }