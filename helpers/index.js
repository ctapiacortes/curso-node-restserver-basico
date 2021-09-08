const dbValidators = require('./db-Validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const parseJWT = require('./parse-jwt');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...parseJWT,
    ...subirArchivo
}