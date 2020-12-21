import express from 'express';

import orderController from '../controllers/order';

export const Router = express.Router()

Router.post('/create-order', orderController.postOrder)

Router.get('/checkout', orderController.getCheckout)
