const getDb = require('./../utils/database').getDb;

const COLLECTION_NAME = 'products';

class Product {
    constructor(title, price, description, imageUrl, category) {
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
}

module.exports = Product