const Order = require("../models/order");
const CartController = require('../controllers/cart')

const getCheckout = async (req, res, next) => {

    let orders =await req.user.getOrder();

    //orders = [orders[orders.length - 1]]

    res.render('shop/checkout', {
        pageTitle: 'Shop do Edian',
        path: '/checkout',
        orders: orders,
        user: req.user
    });
};

const getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Shop do Edian',
        path: '/orders'
    });
};

const postOrder = async (req, res, next) => {

    await req.user.addOrder();

    getCheckout(req, res, next);
};

exports.postOrder = postOrder;
exports.getCheckout = getCheckout;