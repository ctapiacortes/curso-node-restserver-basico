const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;
    try {
        const { nombre, correo, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: 'holiwis',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario en DB tiene estado en false, se debe denegar autenticación
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario no autorizado, favor comunicarse con el administrador'
            })
        }




        res.json({
            usuario,
            id_token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }
}


module.exports = { login, googleSignin }