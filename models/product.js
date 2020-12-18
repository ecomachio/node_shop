const getDb = require('./../utils/database').getDb;

const COLLECTION_NAME = 'products';

class Product {
    constructor(title, imageUrl, price, description, category) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
    }

    save() {
        const db = getDb();
        return db.collection(COLLECTION_NAME).insertOne(this)
            .then(res => console.log(res))
            .catch(res => console.log(res))
    }

    static async fetchAll() {
        const db = getDb();
        return await db.collection(COLLECTION_NAME).find().toArray();
    }
}

module.exports = Product