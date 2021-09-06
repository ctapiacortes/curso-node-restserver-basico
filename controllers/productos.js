const { response } = require("express");
const { Producto, Categoria } = require('../models');


//obtenerCategorias - paginado - total - populate

const obtenerProductos = async(req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}

//obtenerCategoria - populate {}

const obtenerProducto = async(req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

    res.json(producto);
}



const crearProducto = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const productoDB = await Producto.findOne({ nombre });
    const categoria = req.body.categoria.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre: categoria });

    if (!categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoria}, no existe. Favor indicar una categoría válida`
        })
    }

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    //Generar data a guardar
    const data = {
        nombre,
        categoria: categoriaDB._id,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        usuario: req.usuario._id,
    }

    const produto = new Producto(data);

    //Guardar DB

    await produto.save();

    res.status(201).json(produto);

}

//actualizarCategoria

const actualizarProducto = async(req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    data.categoria = req.categoria._id;
    data.precio = req.precio;
    data.descripcion = req.descripcion;
    data.disponible = req.disponible;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto)
}

//borrarCategoria - cambiar estado a false
const borrarProducto = async(req, res = response) => {
    const { id } = req.params;

    //Borrar fisicamente un registro

    //const usuario = await Usuario.findByIdAndDelete(id);
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json({
        producto
    })

}


module.exports = {
    crearProducto,
    actualizarProducto,
    obtenerProductos,
    obtenerProducto,
    borrarProducto
}