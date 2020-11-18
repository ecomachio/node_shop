const path = require('path');

const express = require('express');

const productsController = require('../controllers/products')

const Router = express.Router()

Router.get('/', productsController.getShop)

Router.get('/products', productsController.getAllProducts)
Router.get('/products/:productId', productsController.getProduct)

Router.get('/cart', productsController.getCart)
Router.get('/checkout', productsController.getCheckout)
Router.get('/orders', productsController.getOrders)

Router.post('/cart', productsController.postAddToCart)

Router.use((req, res, next) => {
    console.log("im in the third middleware");
    res.send('<h1>Hello from express</h1>')
})

module.exports = Router;