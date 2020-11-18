const Product = require('../models/product')

const getShop = (req, res, next) => {

    res.render('shop/', {
        pageTitle: 'Shop do Edian',
        path: '/shop'
    });
};

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

const getAllProducts = async (req, res, next) => {

    const products = await Product.fetchAll();

    res.render('shop/product-list', {
        pageTitle: 'Shop do Edian',
        products,
        shopTitle: 'Shop Edian',
        path: '/products'
    });
};

const getAdminProducts = async (req, res, next) => {

    const products = await Product.fetchAll();

    res.render('admin/products', {
        pageTitle: 'Shop do Edian - Admin',
        products,
        shopTitle: 'Shop Edian',
        path: '/admin/products'
    });
};


const getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

const postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    let prod = new Product(title, imageUrl, price, description);
    prod.save();

    res.redirect('/shop')
}

const getCart = async (req, res, next) => {

    res.render('shop/cart', {
        pageTitle: 'Shop do Edian',
        path: '/shop/cart'
    });
};

exports.postAddProduct = postAddProduct;
exports.getAddProduct = getAddProduct;
exports.getAllProducts = getAllProducts;
exports.getShop = getShop;
exports.getCart = getCart;
exports.getCheckout = getCheckout;
exports.getAdminProducts = getAdminProducts;
exports.getOrders = getOrders;
