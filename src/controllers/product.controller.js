import {cartsService, productsService, usersService} from "../repositories/index.js"
import productModel from "../dao/models/product.model.js"
import nodemailer from "nodemailer"


export const updateProductById = async (req, res) => {
    let { pid } = req.params
    let productToReplace = req.body
    if (!productToReplace.nombre || !productToReplace.descripcion || !productToReplace.precio || !productToReplace.category || !productToReplace.stock) {
        res.send({ status: "error", error: "no hay datos en parametros" })
    }
    let result = await productsService.updateProductById(pid, productToReplace)
    res.send({ result: "success", payload: result })
}

export const deleteProduct = async (req, res) => {
    let pid = req.params.pid

    if (req.user.role === "premium"){
        let productFound = await productsService.getProductById(pid)
        if (productFound.owner.equals(req.user._id)){
            const userFound = await usersService.getById(productFound.owner)

            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                auth: {
                    user: "parcepaiva@gmail.com",
                    pass: "yydj uzct rbyg bluz"
                }
            })
            const mailOptions = {
                from: "CoderTienda contact <parcepaiva@gmail.com>",
                to: `${userFound.email}`,
                subject: `Eliminacion de producto ${productFound.nombre}`,
                html: `
                <html>
                    <head>
                    </head>
                    <body>
                        <div> El producto ${productFound.nombre} que te pertenece fue eliminado</div>
                    </body>
                </html>`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    res.send("Error al enviar correo")
                } else {
                    res.send(`Correo enviado`)
                }
            })
            let result = await productsService.deleteProductById(pid)
            res.send({ result: "success", message: `Producto eliminado con exito ${productFound.nombre}` })
        }else{
            res.status(404).send({ status: "error", message: "Producto no pertenece al usuario premium autenticado" });
        }
    }else{
        await productsService.deleteProductById(pid)
        res.send({ result: "success", message: `Producto: ${productFound.nombre}, fue eliminado con exito ` })
    } 

}

export const postProduct = async (req, res) => {
    let { nombre, descripcion, category, precio, stock } = req.body
    if (!nombre || !descripcion || !category || !precio || !stock) {
        return res.send({ status: "error", error: "faltan datos" })
    }else{
        const newProduct = {nombre, descripcion, category, precio, stock, owner:req.user._id}
        await productsService.postProduct(newProduct)
        res.status(400).send({ result: "success", payload: newProduct })
    }

}

export const getProduct = async (req, res) => {
    const productId = req.params.pid
    let producto = await productsService.getProductById(productId)

    const { token } = req.cookies
    let userFound = await usersService.getUserByToken(token) 

    res.render("productDetail.hbs", {
        cart: userFound.cart,
        name: producto.nombre,
        descripcion: producto.descripcion,
        category: producto.category,
        precio: producto.precio,
        stock: producto.stock,
        id: producto._id
    })

}

export const getAllProducts = async (req, res) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const sortDirection = req.query.sortDirection || ''
    const category = req.query.category || ""

    const sortOptions = {};
    if (sortDirection === 'asc') {
        sortOptions.precio = 1;
    } else if (sortDirection === 'des') {
        sortOptions.precio = -1;
    }

    const filterOptions = {};
    if (category) {
        filterOptions.category = category;
    }

 
    productModel.paginate(filterOptions, { page, limit, sort: sortOptions }, async(err, result) => {
        if (err) {
            return res.status(500).json({ result: 'error', payload: null });
        }
        const prevPage = result.page > 1 ? result.page - 1 : null;
        const nextPage = result.page < result.totalPages ? result.page + 1 : null;

        const { token } = req.cookies
        let userFound = await usersService.getUserByToken(token) 
        let cartFound = await cartsService.getCartById(userFound.cart)
        res.render("products.hbs", {
            url:req.originalUrl,
            user: userFound,
            cart: cartFound.products,
            productos: result.docs,
            totalPage: result.totalPages,
            prevPage,
            nextPage,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevPage ? `/products?page=${prevPage}&limit=${limit}&sortDirection=${sortDirection}&category=${category}` : null,
            nextLink: nextPage ? `/products?page=${nextPage}&limit=${limit}&sortDirection=${sortDirection}&category=${category}` : null,
        },);
    })

}

