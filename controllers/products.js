const Product = require('../models/product');
const Cart = require('../models/cart');

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

const getProduct = async (req, res, next) => {

    const prodId = req.params.productId;

    const [product] = await Product.findById(prodId);

    console.log(product);

    res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product,
    });
}

const getAllProducts = async (req, res, next) => {

    const [products] = await Product.fetchAll();

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
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

const postAddProduct = async (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const category = req.body.category

    let prod = new Product(null, title, imageUrl, price, description, category);
    try {
        const { insertId } = await prod.save();
        console.log(insertId);
    } catch (error) {
        console.error(error);
    }
    res.redirect('/shop')
}

const getEditProduct = async (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) {
        return res.redirect('/shop')
    }

    const prodId = req.params.id;
    let product = await Product.findById(prodId);

    if (!product) {
        return res.redirect('/shop')
    }

    res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        product: product
    });
};

const postEditProduct = (req, res, next) => {
    const id = req.body.id
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const category = req.body.category

    let prod = new Product(id, title, imageUrl, price, description, category);
    prod.save();
    res.redirect('/shop')
};

const deleteProduct = async (req, res, next) => {
    const id = req.params.id
    let prod = await Product.findById(id);
    prod.delete();
    res.redirect('/shop')
};



exports.postAddProduct = postAddProduct;
exports.getAddProduct = getAddProduct;
exports.getAllProducts = getAllProducts;
exports.getShop = getShop;

exports.getCheckout = getCheckout;
exports.getAdminProducts = getAdminProducts;
exports.getOrders = getOrders;
exports.getProduct = getProduct;

exports.getEditProduct = getEditProduct;
exports.postEditProduct = postEditProduct;
exports.deleteProduct = deleteProduct;
