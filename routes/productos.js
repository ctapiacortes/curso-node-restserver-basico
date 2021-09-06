const { Router } = require('express')
const { check } = require('express-validator');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId } = require('../helpers/db-Validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router()

// Obtener todas las categorias - público
router.get('/', obtenerProductos)

// Obtener una categoria por id - público
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto)

//Crear producto - privado - cualquier persona con un token válido
router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('precio', 'El precio debe ser un valor numerico valido').isNumeric(),
        validarCampos
    ], crearProducto)
    //Actualizar una categoria - privado - cualquier persona con un token válido
router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id').custom(existeProductoPorId),
        validarCampos
    ], actualizarProducto)
    //Borrar una cateogoria - privado - sólo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto)

//Crear middleware para validar ID


module.exports = router;