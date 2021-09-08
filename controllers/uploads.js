const { response, request } = require("express");
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');
const fs = require('fs');
const path = require('path')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);


const cargarArchivos = async(req, res = response) => {

    const extensiones = ['txt', 'md']

    try {
        const nombre = await subirArchivo(req.files, extensiones, 'textos');

        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }



}

const actualizarArchivos = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Aún no validado' });
    }

    //Limpiar imagenes previas
    try {
        if (modelo.img) {
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }
    } catch (error) {
        console.log(error);
    }

    const nombre = await subirArchivo(req.files, ['gif', 'jpg', 'jpeg', 'png'], coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json({ modelo })
}

const mostrarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Aún no validado' });
    }

    //Limpiar imagenes previas


    if (modelo.img) {

        //Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }
    const noImage = path.join(__dirname, '../assets', 'no-image.jpg')
    res.sendFile(noImage)

    //res.json({ msg: 'Acá se mostrará la imagen' });
}

const actualizarArchivosCloudinary = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Aún no validado' });
    }

    //Limpiar imagenes previas
    try {
        if (modelo.img) {
            //Hay que borrar la imagen del servidor
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }
    } catch (error) {
        console.log(error);
    }
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    //const nombre = await subirArchivo(req.files, ['gif', 'jpg', 'jpeg', 'png'], coleccion);
    modelo.img = secure_url;

    await modelo.save();

    res.json({ modelo })
}

module.exports = { cargarArchivos, actualizarArchivos, mostrarImagen, actualizarArchivosCloudinary }