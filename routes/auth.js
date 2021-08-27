const { Router } = require('express')
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router()

router.post('/login', [
    check('correo', 'El correo es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('correo', 'El correo debe ser valido').isEmail(),
    validarCampos
], login)

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin)


module.exports = router;