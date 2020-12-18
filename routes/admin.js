const path = require('path');

const express = require('express');

const productsController = require('../controllers/products');

const Router = express.Router();

Router.get('/add-product', productsController.getAddProduct);

Router.get('/products', productsController.getAdminProducts);

Router.post('/add-product', productsController.postAddProduct);

Router.get('/edit-product/:id', productsController.getEditProduct);

Router.post('/edit-product', productsController.postEditProduct);

Router.post('/delete-product/:id', productsController.deleteProduct);

module.exports = Router;