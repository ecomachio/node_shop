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

        //add / plus quantity
    }
}

module.exports = Cart;