const Product = require('../models/product')

const getAllProducts = async (req, res, next) => {

    const products = await Product.fetchAll();
    
    res.render('shop',
        {
            pageTitle: 'Shop do Edian',
            products,
            shopTitle: 'Shop Edian',
            path: '/shop'
        });
};

const getAddProduct = (req, res, next) => {
    res.render('add-product',
        {
            pageTitle: 'Add Product',
            path: '/admin/add-product'
        }
    )
};

const postAddProduct = (req, res, next) => {
    let prod = new Product(req.body.title);
    prod.save();

    res.redirect('/shop')
}

exports.postAddProduct = postAddProduct;
exports.getAddProduct = getAddProduct;
exports.getAllProducts = getAllProducts;
