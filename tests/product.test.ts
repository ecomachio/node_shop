import Product from '../src/models/product';
import { expect } from 'chai';
import 'mocha';
import { getDb, mongoConnect, mongoDisconnect } from '../src/utils/database';
import * as chai from 'chai';
import chaiThings from 'chai-things';
import { InsertOneWriteOpResult, UpdateWriteOpResult } from 'mongodb';

chai.should();
chai.use(chaiThings);

describe('Product tests',
    () => {
        // tslint:disable-next-line: only-arrow-functions
        before(async function () {
            await mongoConnect("mongodb+srv://nodeshopdb:admin@cluster0.rweci.mongodb.net/nodeshopdb_test?retryWrites=true&w=majority")
            const products = [];
            products.push(
                new Product(
                    'teste',
                    'https://radio93fm.com.br/wp-content/uploads/2019/02/produto.png',
                    300,
                    'test1',
                    'test cat1'
                ),
                new Product(
                    'teste 2',
                    'https://radio93fm.com.br/wp-content/uploads/2019/02/produto.png',
                    300,
                    'test2',
                    'test cat2'
                ),
                new Product(
                    'teste 3',
                    'https://radio93fm.com.br/wp-content/uploads/2019/02/produto.png',
                    300,
                    'test3',
                    'test cat3'
                )
            );

            for (const p of products) {
                await p.save();
            }

        });
        // tslint:disable-next-line: only-arrow-functions
        it('should fetch all products', async function () {
            const result = await Product.fetchAll();
            result.should.all.have.property('_id');
        });
        // tslint:disable-next-line: only-arrow-functions
        it('should fetch all products with the right properties', async function () {
            const result = await Product.fetchAll();
            result.should.include.something.that.have.property('title', 'teste')
            result.should.include.something.that.have.property('price', 300)
            result.should.include.something.that.have.property('description', 'test1')
            result.should.include.something.that.have.property('imageUrl', 'https://radio93fm.com.br/wp-content/uploads/2019/02/produto.png')
            result.should.include.something.that.have.property('category', 'test cat1')

            result.should.include.something.that.have.property('title', 'teste 2')
            result.should.include.something.that.have.property('price', 300)
            result.should.include.something.that.have.property('description', 'test2')
            result.should.include.something.that.have.property('imageUrl', 'https://radio93fm.com.br/wp-content/uploads/2019/02/produto.png')
            result.should.include.something.that.have.property('category', 'test cat2')

            result.should.include.something.that.have.property('title', 'teste 3')
            result.should.include.something.that.have.property('price', 300)
            result.should.include.something.that.have.property('description', 'test3')
            result.should.include.something.that.have.property('imageUrl', 'https://radio93fm.com.br/wp-content/uploads/2019/02/produto.png')
            result.should.include.something.that.have.property('category', 'test cat3')
        });
        // tslint:disable-next-line: only-arrow-functions
        it('should fetch one product with the right properties', async function () {
            const products = await Product.fetchAll() as any;

            const result = await Product.fetch(products[0]._id);

            result.should.have.property('id');
            result.should.have.property('title', 'teste')
            result.should.have.property('price', 300)
            result.should.have.property('description', 'test1')
            result.should.have.property('imageUrl', 'https://radio93fm.com.br/wp-content/uploads/2019/02/produto.png')
            result.should.have.property('category', 'test cat1')
        });
        // tslint:disable-next-line: only-arrow-functions
        it('should add a new Product', async function () {

            const productName = 'teste new';
            const productImage = 'https://radio93fm.com.br/wp-content/uploads/2019/02/produto.png';
            const productPrice = 300;
            const productDescription = 'test3';
            const productCategory = 'test cat3';

            const product = new Product(
                productName,
                productImage,
                productPrice,
                productDescription,
                productCategory
            );

            const res = (await product.save()) as InsertOneWriteOpResult<any>;
            expect(res.result.ok).to.equal(1);
            res.ops.should.include.something.that.have.property('title', productName)
            res.ops.should.include.something.that.have.property('price', productPrice)
            res.ops.should.include.something.that.have.property('description', productDescription)
            res.ops.should.include.something.that.have.property('imageUrl', productImage)
            res.ops.should.include.something.that.have.property('category', productCategory)
        });
        // tslint:disable-next-line: only-arrow-functions
        it('should update a Product', async function () {

            const products = await Product.fetchAll() as any;

            products[0].price = 250;

            const res = (await new Product(products[0].title,
                products[0].imageUrl,
                products[0].price,
                products[0].description,
                products[0].category,
                products[0]._id
            ).save()) as UpdateWriteOpResult;

            expect(res.result.ok).to.equal(1);
            expect(res.matchedCount).to.equal(1);
            expect(res.modifiedCount).to.equal(1)
        });

        // tslint:disable-next-line: only-arrow-functions
        after(function (done) {
            getDb().collection('products').deleteMany({}).then(() => {
                mongoDisconnect().then(() => {
                    done();
                });
            });
        });
    });