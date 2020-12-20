const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');
const ProductController = require('./products');

const getCart = async (req, res, next) => {

    try {        
        const cart = await req.user.getCart();
        const cartItems = cart.items;

        res.render('shop/cart', {
            pageTitle: 'Shop do Edian',
            path: '/shop/cart',
            products: cartItems,
            totalPrice: cart.totalPrice,
        });
    } catch (error) {
        console.error(error);
    }
};

const postAddToCart = async (req, res, next) => {

    try {
        const prodId = req.body.productId;
        const prod = await Product.fetch(prodId);
        
        await req.user.addToCart(prod);
        await ProductController.getAllProducts(req, res, next);
    } catch (error) {
        console.error(error);
    }
}

const postCartDeleteProduct = async (req, res, next) => {

    const prodId = req.params.id;

    try {
        const cart = await req.user.getCart();

        const cartProducts = cart.items

        //await cartProducts[0]['cart-item'].destroy();

    } catch (error) {
        console.error(error);
    }

    res.redirect('/shop/cart');
}

const addItemToCart = async (prodId, cart) => {

    const cartItems = await cart.getProducts({ where: { id: prodId } });
    const itemInCart = cartItems[0];
    let newCartItem;
    try {
        if (itemInCart) {

            await cart.addProduct(
                itemInCart,
                {
                    through:
                        { quantity: itemInCart['cart-item'].quantity + 1 }
                }
            );

        } else {
            const product = await Product.findByPk(prodId);
            newCartItem = { product, cartItem: { quantity: 1 } };
            await cart.addProduct(
                newCartItem.product,
                { through: newCartItem.cartItem }
            );
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const clearCart = async (cart) => {
    await cart.setProducts(null);
    cart.totalPrice = 0;
    await cart.save();
}

exports.getCart = getCart;
exports.postAddToCart = postAddToCart;
exports.postCartDeleteProduct = postCartDeleteProduct;
exports.clearCart = clearCart;