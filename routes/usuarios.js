const { Router } = require('express')
const { check } = require('express-validator')
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios')
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-Validators')

const { validarCampos, validarJWT, tieneRol } = require('../middlewares')

// const { validarCampos } = require('../middlewares/validar-campos')
// const { validarJWT } = require('../middlewares/validar-jwt')
// const { tieneRol } = require('../middlewares/validar-roles')


const router = Router()

router.get('/', usuariosGet)

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria y debe contener más de 6 letras').isByteLength({ min: 6 }),
    //check('rol', 'No es un rol permitido').isIn(['USER_ROLE', 'ADMIN_ROLE']),
    check('rol').custom(esRolValido),
    check('correo').custom(emailExiste),
    validarCampos
], usuariosPost)

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete)


module.exports = router;