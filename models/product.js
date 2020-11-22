const fs = require('fs')
const path = require('path')

const fileUtil = require('../utils/file');
const Cart = require('./cart')

const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

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

        fileUtil.getFromFile('products').then((products) => {
            if (this.id) {
                let productIndex = products.findIndex(p => p.id === this.id)
                products[productIndex] = this;
            } else {
                this.id = Math.random().toString();
                products.push(this);
            }
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.error(err);
            })
        })
    }

    async delete() {
        let products = await fileUtil.getFromFile('products');
        if (products) {
            const updatedProducts = products.filter(p => p.id !== this.id)

            try {
                //delete product from Cart
                await Cart.deleteProduct(this)

                //delete product from file
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.error(err);
                    return;
                })

            } catch (error) {
                console.error(error);
                return;
            }
        }
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
            const p = products.find(p => p.id === id);
            return new Product(p.id, p.title, p.imageUrl, p.price, p.description, p.category);
        }

        return {}

    }
}

module.exports = Product;