const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

const getProductsFromFile = () => {
    return new Promise((res, rej) => {
        fs.readFile(p, "utf8", (err, data) => {
            if (err) {
                return res([]);
            } else {
                if (!data) {
                    return res([]);
                } else {
                    return res(JSON.parse(data));
                }
            }
        })
    })
}

class Product {
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        getProductsFromFile().then((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.error(err);
            })
        })
    }

    static async fetchAll() {
        let products = []
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

        return await getProductsFromFile();
    }
}

module.exports = Product;