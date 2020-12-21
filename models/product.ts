import mongodb, { ObjectId } from 'mongodb';
import { getDb as getDb } from './../utils/database';

const COLLECTION_NAME = 'products';

export default class Product {
    public title: string;
    public price: number;
    public description: string;
    public imageUrl: string;
    public category: string;
    public _id: ObjectId | undefined;

    constructor(title: string, imageUrl: string, price: number, description: string, category: string, id?: ObjectId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
        this._id = id;
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

    static async fetch(id: ObjectId) {
        const db = getDb();
        console.log(id);
        return await db.collection(COLLECTION_NAME).findOne({ _id: new mongodb.ObjectId(id) })
    }

    static async fetchAll() {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).find().toArray();
    }

    static async delete(id: ObjectId) {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).deleteOne({ _id: new mongodb.ObjectId(id) })
    }
}
