const db = require('../utils/database');

const Cart = require('./cart')

class Product {
    constructor(id, title, imageUrl, price, description, category) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.category = category;
    }

    save() {
        return db.execute(
            'INSERT INTO products (title, price, description, imageUrl, category) VALUES (?, ?, ?, ?, ?)',
            [this.title, this.price, this.description, this.imageUrl, this.category]
        )
    }

    async delete() {

    }

    static async fetchAll() {
        return db.execute('select * from products');
    }

    static async findById(id) {
        return db.execute(`select * from products where id = ?`, [id]);
    }
}

module.exports = Product;