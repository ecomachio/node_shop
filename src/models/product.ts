import mongodb, { ObjectId } from 'mongodb';
import { getDb as getDb } from './../utils/database';

const COLLECTION_NAME = 'products';

export default class Product {
    public title: string;
    public price: number;
    public description: string;
    public imageUrl: string;
    public category: string;
    public id: ObjectId | undefined;

    constructor(title: string, imageUrl: string, price: number, description: string, category: string, id?: ObjectId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
        this.id = id;
    }

    save = () => {
        const db = getDb();
        if (this.id) {
            return db.collection(COLLECTION_NAME).updateOne(
                { _id: this.id },
                { $set: this }
            );
        } else {
            return db.collection(COLLECTION_NAME).insertOne(this);
        }
    }

    static async fetch(id: ObjectId) {
        const db = getDb();
        const res = await db.collection(COLLECTION_NAME).findOne({ _id: id }) as any;

        return new Product(res.title, res.imageUrl, res.price, res.description, res.category, res._id);

    }

    static async fetchAll(): Promise<Product[]> {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).find().toArray();
    }

    static async delete(id: ObjectId) {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).deleteOne({ _id: new mongodb.ObjectId(id) })
    }
}
