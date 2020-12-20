const getDb = require('../utils/database').getDb;
const mongodb = require('mongodb');

const COLLECTION_NAME = 'users';
const COLLECTION_PRODUCTS = 'products';
const COLLECTION_ORDERS = 'orders';

class User {
    constructor(name, email, cart, id) {
        this.name = name
        this.email = email
        this.cart = cart || this.clearCart()
        this._id = id ? mongodb.ObjectId(id) : null;
    }

    static async save() {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).insertOne(this);
    }

    async addToCart(product) {
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

        return 
    }

    async deleteItemFromCart(product) {
        this.cart.items = this.cart.items.filter(item => !item.productId.equals(product._id))

        return this.saveCart();
    }

    async getCart() {
        const prodIds = this.cart.items.map(i => i.productId)

        let products = await getDb().collection(COLLECTION_PRODUCTS).find(
            { _id: { $in: prodIds } }
        ).toArray();
        console.log(products);
        products = products.map(p => {
            return {
                ...p,
                quantity: this.cart.items.find(item => item.productId.equals(p._id)).quantity
            }
        })

        this.cart.totalPrice = this.getTotalPrice(products);

        this.saveCart();

        return {
            items: [...products],
            totalPrice: this.cart.totalPrice
        };
    }

    async addOrder() {
        getDb().collection(COLLECTION_ORDERS).insertOne({
            userId: this._id,
            order: this.cart,
        })

        this.clearCart();
        this.saveCart();
    }

    async saveCart() {
        return await getDb().collection(COLLECTION_NAME).updateOne(
            { _id: this._id },
            { $set: { cart: this.cart } }
        )
    }

    clearCart() {
        return { items: [], totalPrice: 0 };
    }

    getTotalPrice(products) {
        return products.reduce((pv, cv) => pv + +cv.price * +cv.quantity, 0)
    }

    static async fetch(id) {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).findOne({ _id: new mongodb.ObjectId(id) });
    }

}

module.exports = User