const fs = require('fs')
const path = require('path')

const fileUtil = require('../utils/file');

const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

class Product {
    constructor(title, imageUrl, price, description, category) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.category = category;
    }

    save() {
        this.id = Math.random().toString();
        fileUtil.getFromFile('products').then((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.error(err);
            })
        })
    }

    static async fetchAll() {
        let products = await fileUtil.getFromFile('products');
        if (products)
            return products
        else return []
    }

    static async findById(id) {
        let products = await fileUtil.getFromFile('products');

        if (products) {
            return products.find(p => p.id === id);
        }

        return {}

    }
}

module.exports = Product;