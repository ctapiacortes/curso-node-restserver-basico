const { Router } = require('express')
const { check } = require('express-validator');
const { cargarArchivos, mostrarImagen, actualizarArchivosCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-Validators');
const { validarCampos, validarArchivo } = require('../middlewares');

const router = Router()

router.post('/', validarArchivo, cargarArchivos);

router.put('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarArchivo,
    validarCampos
], actualizarArchivosCloudinary);

router.get('/:coleccion/:id', [check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

module.exports = router;