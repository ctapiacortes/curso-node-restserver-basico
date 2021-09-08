const { v4: uuidv4 } = require('uuid');
const path = require('path');


const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        console.log(nombreCortado);
        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension}, no es permitida. Extensiones válidas: ${extensionesValidas}`);
        }

        const nombreTemporalArchivo = uuidv4() + '.' + extension;
        console.log(nombreTemporalArchivo);
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporalArchivo);

        archivo.mv(uploadPath, function(err) {
            if (err) {
                reject(err);
            }

            resolve(nombreTemporalArchivo);
        });
    })


}

module.exports = {
    subirArchivo
}