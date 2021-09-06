const { Router } = require('express')
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-Validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router()

// Obtener todas las categorias - público
router.get('/', obtenerCategorias)

// Obtener una categoria por id - público
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria)

//Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], crearCategoria)
    //Actualizar una categoria - privado - cualquier persona con un token válido
router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id').custom(existeCategoria),
        validarCampos
    ], actualizarCategoria)
    //Borrar una cateogoria - privado - sólo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria)

//Crear middleware para validar ID


module.exports = router;