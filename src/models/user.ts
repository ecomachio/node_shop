import { getDb } from '../utils/database';
import mongodb, { ObjectId } from 'mongodb';
import Product from './product';
import CartProduct from './cartProduct';

const COLLECTION_NAME = 'users';
const COLLECTION_PRODUCTS = 'products';
const COLLECTION_ORDERS = 'orders';

export default class User {
    public name: string;
    public email: string;
    public cart: any;
    public _id: ObjectId;

    constructor(name: string, email: string, cart: any, id: ObjectId) {
        this.name = name
        this.email = email
        this.cart = cart || this.clearCart()
        this._id = id;
    }

    static async save() {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).insertOne(this);
    }

    async addToCart(product: CartProduct) {
        const cartProduct = this.cart.items.find((cp: any) => {
            return cp._id.equals(product.id || "")
        })

        if (cartProduct) {
            cartProduct.quantity++
            this.cart.totalPrice += +product.price;
        } else {
            this.cart.items.push({ _id: product.id, quantity: 1 });
            this.cart.totalPrice += +product.price;
        }

        return this.saveCart();
    }

    async deleteItemFromCart(product: CartProduct) {
        this.cart.items = this.cart.items.filter((item: CartProduct) => !item.id?.equals(product.id || ""))

        return this.saveCart();
    }

    async getCart() {
        const prodIds = this.cart.items.map((i: any) => i._id)
        let products = await this.findProducts(prodIds);

        products = products.map(p => {
            return {
                ...p,
                quantity: this.cart.items.find((item: any) => item._id.equals(p._id)).quantity
            }
        })

        this.cart.totalPrice = this.getTotalPrice(products);

        this.saveCart();

        return {
            items: [...products],
            totalPrice: this.cart.totalPrice
        };
    }

    async findProducts(prodIds: ObjectId[]) {
        return await getDb().collection(COLLECTION_PRODUCTS).find(
            { _id: { $in: prodIds } }
        ).toArray();
    }

    async getOrder() {
        return await getDb().collection(COLLECTION_ORDERS)
            .findOne({ 'userId': this._id }, { sort: { _id: -1 } })

    }

    async addOrder() {
        const prodIds = this.cart.items.map((i: any) => i._id)

        let products = await this.findProducts(prodIds);

        products = products.map(p => {
            return {
                ...p,
                quantity: this.cart.items.find((item: any) => item?._id?.equals(p._id)).quantity
            }
        })

        const res = await getDb().collection(COLLECTION_ORDERS).insertOne({
            userId: this._id,
            order: {
                items: [...products],
                totalPrice: this.cart.totalPrice
            },
        })

        this.cart = this.clearCart();
        this.saveCart();

        return res;
    }

    async saveCart() {
        return await getDb().collection(COLLECTION_NAME).updateOne(
            { _id: this._id },
            { $set: { cart: this.cart } }
        )
    }

    clearCart() {
        return { items: [] as CartProduct[], totalPrice: 0 };
    }

    getTotalPrice(products: CartProduct[]) {
        return products.reduce((pv, cv) => pv + +cv.price * +cv.quantity, 0)
    }

    static async fetch(id: any) {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).findOne({ _id: new mongodb.ObjectId(id) });
    }

}
