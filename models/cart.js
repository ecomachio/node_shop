const fs = require('fs')
const path = require('path')

const fileUtil = require('../utils/file');

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

class Cart {
    constructor() {

    }

    static async addProduct(prod) {

        let cart = { products: [], totalPrice: 0 };

        //fetch the cart from file
        const existingCart = await fileUtil.getFromFile('cart');

        if (existingCart) {
            cart = existingCart;
        }

        let existingProduct = cart.products.find(p => p.id === prod.id);

        if (existingProduct) {
            existingProduct.qty++;
            console.log(cart);
        } else {
            existingProduct = { id: prod.id, qty: 1 }
            cart.products.push(existingProduct);
        }
        cart.totalPrice = parseInt(cart.totalPrice) + parseInt(prod.price);

        fs.writeFile(p, JSON.stringify(cart), (err) => {
            console.error(err);
        })

    }

    static async deleteProduct(product) {
        const cart = await fileUtil.getFromFile('cart');

        const productFromCart = cart.products.find(p => p.id === product.id);

        if (!productFromCart) {
            return;
        }

        //subtract que qty before deleting
        cart.totalPrice = cart.totalPrice - (product.price * productFromCart.qty);

        //delete product from cart
        cart.products = cart.products.filter(p => p.id !== product.id);

        fs.writeFile(p, JSON.stringify(cart), (err) => {
            console.error(err);
        })
    }

    static async getCart() {
        const cart = await fileUtil.getFromFile('cart');
        return cart;
    }
}

module.exports = Cart;