const getDb = require('../utils/database').getDb;
const mongodb = require('mongodb');

const COLLECTION_NAME = 'users';

class User {
    constructor(name, email, cart, id) {
        this.name = name
        this.email = email
        this.cart = cart || { items: [], totalPrice: 0 }
        this._id = id ? mongodb.ObjectId(id) : null;
    }

    static async save() {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).insertOne(this);
    }

    addToCart(product) {
        let cartProduct = this.cart.items.find((cp) => {
            console.log(cp.productId, product._id);
            return cp.productId.equals(product._id)
        })

        if (cartProduct) {
            cartProduct.quantity++
            this.cart.totalPrice += +product.price;
        } else {
            this.cart.items.push({ productId: product._id, quantity: 1 });
            this.cart.totalPrice += +product.price;
        }

        return getDb().collection(COLLECTION_NAME).updateOne(
            { _id: this._id },
            { $set: { cart: this.cart } }
        )
    }

    static async fetch(id) {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).findOne({ _id: new mongodb.ObjectId(id) });
    }

}

module.exports = User