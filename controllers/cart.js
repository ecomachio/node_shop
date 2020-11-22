const Product = require('../models/product');
const Cart = require('../models/cart');

const getCart = async (req, res, next) => {

    let cartProducts = {};

    let cart = await Cart.getCart();
    if (!cart) {
        cartProducts = { productData: null, qty: 0 }
    } else {
        cartProducts = await Promise.all(cart.products.map(async cp => {
            const prod = await Product.findById(cp.id);
            return {
                productData: prod,
                qty: cp.qty,

            }
        }))
    }
    console.log(cartProducts);

    res.render('shop/cart', {
        pageTitle: 'Shop do Edian',
        path: '/shop/cart',
        products: cartProducts,
        totalPrice: cart.totalPrice,
    });
};

const postAddToCart = async (req, res, next) => {

    const prodId = req.body.productId;

    let prod = await Product.findById(prodId);

    Cart.addProduct(prod);

    res.redirect('/shop/cart');
}

const postCartDeleteProduct = async (req, res, next) => {

    const prodId = req.params.id;
    console.log("asd", prodId);
    let prod = await Product.findById(prodId);

    await Cart.deleteProduct(prod);

    res.redirect('/shop/cart');
}


exports.getCart = getCart;
exports.postAddToCart = postAddToCart;
exports.postCartDeleteProduct = postCartDeleteProduct;