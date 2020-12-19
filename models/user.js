const getDb = require('../utils/database').getDb;
const mongodb = require('mongodb');

const COLLECTION_NAME = 'users';

class User {
    constructor(name, email, cart, id) {
        this.name = name
        this.email = email
        this.cart = cart
        this._id = id ? mongodb.ObjectId(id) : null;
    }

    static async save() {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).insertOne(this);
    }

    addToCart(product) {
        const cart = { items: [{ productId: product._id, quantity: 1 }] }
        const db = getDb();
        return db.collection(COLLECTION_NAME).updateOne(
            { _id: this._id },
            { $set: { cart: cart } }
        )
    }

    static async fetch(id) {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).findOne({ _id: new mongodb.ObjectId(id) });
    }

}

module.exports = User