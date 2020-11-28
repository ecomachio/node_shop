const Order = require("../models/order");

const getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Shop do Edian',
        path: '/checkout'
    });
};

const getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Shop do Edian',
        path: '/orders'
    });
};

const postOrder = async (req, res, next) => {

    const cart = await req.user.getCart();
    const products = await cart.getProducts();

    const newOrder = await req.user.createOrder();

    const orderProducts = products.map(prod => {
        prod['order-item'] = { quantity: prod['cart-item'].quantity };
        return prod;
    })

    newOrder.addProducts(orderProducts);
    newOrder.totalPrice = cart.totalPrice;
    await newOrder.save();

    res.render('shop/orders', {
        pageTitle: 'Shop do Edian',
        path: '/orders'
    });
};

exports.postOrder = postOrder;