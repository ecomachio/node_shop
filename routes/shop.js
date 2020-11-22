const path = require('path');

const express = require('express');

const productsController = require('../controllers/products')
const cartController = require('../controllers/cart')

const Router = express.Router()

Router.get('/', productsController.getShop)

Router.get('/products', productsController.getAllProducts)
Router.get('/products/:productId', productsController.getProduct)

Router.get('/checkout', productsController.getCheckout)
Router.get('/orders', productsController.getOrders)

Router.get('/cart', cartController.getCart)
Router.post('/cart', cartController.postAddToCart)

Router.post('/cart-delete-item/:id', cartController.postCartDeleteProduct)

Router.use((req, res, next) => {
    console.log("im in the third middleware");
    res.send('<h1>Hello from express</h1>')
})

module.exports = Router;