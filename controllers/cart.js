const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');
const ProductController = require('./products');

const getCart = async (req, res, next) => {

    try {
        const cart = await req.user.getCart();
        const cartItems = await cart.getProducts();

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
        const cart = await req.user.getCart();

        if (await addItemToCart(prodId, cart)) {
            const cartItems = await cart.getProducts();
            cart.totalPrice = cartItems.reduce((totalPrice, cv) => {
                return totalPrice + cv.price * cv['cart-item'].quantity;
            }, 0)
            await cart.save()
            //this wil render the page products
            await ProductController.getAllProducts(req, res, next);
        } else {
            throw "kk k num deu";
        }
    } catch (error) {
        console.error(error);
    }
}

const postCartDeleteProduct = async (req, res, next) => {

    const prodId = req.params.id;

    try {
        const cart = await req.user.getCart();

        const cartProducts = await cart.getProducts({ where: { id: prodId } });

        await cartProducts[0]['cart-item'].destroy();

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