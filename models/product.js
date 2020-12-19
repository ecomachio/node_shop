const mongodb = require('mongodb');
const getDb = require('./../utils/database').getDb;

const COLLECTION_NAME = 'products';

class Product {
    constructor(title, imageUrl, price, description, category, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
        this._id = id ? mongodb.ObjectId(id) : null
    }

    save() {
        const db = getDb();
        if (this._id) {
            return db.collection(COLLECTION_NAME).updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: this }
            );
        } else {
            return db.collection(COLLECTION_NAME).insertOne(this);
        }
    }

    static async fetch(id) {
        const db = getDb();
        console.log(id);
        return await db.collection(COLLECTION_NAME).findOne({ _id: new mongodb.ObjectId(id) })
    }

    static async fetchAll() {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).find().toArray();
    }

    static async delete(id) {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).deleteOne({ _id: new mongodb.ObjectId(id) })
    }
}

module.exports = Product