const Product = require('../models/product');

const getShop = (req, res, next) => {

    res.render('shop/', {
        pageTitle: 'Shop do Edian',
        path: '/shop'
    });
};

const getProduct = async (req, res, next) => {

    const prodId = req.params.productId;

    const product = await Product.fetch(prodId);

    res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product,
    });
}

const getAllProducts = async (req, res, next) => {

    const products = await Product.fetchAll();
    const productsCount = products.length;

    res.render('shop/product-list', {
        pageTitle: 'Shop do Edian',
        products,
        shopTitle: 'Shop Edian',
        path: '/products',
        productsCount
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
    const { title, imageUrl, price, description, category } = req.body
    
    const product = new Product(title, imageUrl, price, description, category);    

    try {
        await product.save();
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
    let product = await Product.fetch(prodId);
    
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

const postEditProduct = async (req, res, next) => {
    const { _id, title, imageUrl, price, description, category } = req.body;

    const product = new Product(title, imageUrl, price, description, category, _id);

    await product.save();
    res.redirect('/shop')
};

const deleteProduct = async (req, res, next) => {
    const id = req.params.id
    await Product.delete(id);
    res.redirect('/shop')
};

exports.postAddProduct = postAddProduct;
exports.getAddProduct = getAddProduct;
exports.getAllProducts = getAllProducts;
exports.getShop = getShop;


exports.getAdminProducts = getAdminProducts;

exports.getProduct = getProduct;

exports.getEditProduct = getEditProduct;
exports.postEditProduct = postEditProduct;
exports.deleteProduct = deleteProduct;
