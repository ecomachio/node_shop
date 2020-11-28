const express = require('express');

const orderController = require('../controllers/order');

const Router = express.Router()

Router.post('/create-order', orderController.postOrder)

Router.get('/checkout', orderController.getCheckout)
//Router.get('/orders', orderController.getOrders)

module.exports = Router;