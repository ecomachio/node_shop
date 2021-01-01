import Product from '../src/models/product';
import { expect } from 'chai';
import 'mocha';
import { getDb, mongoConnect, mongoDisconnect } from '../src/utils/database';
import * as chai from 'chai';
import chaiThings from 'chai-things';

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
        after(function (done) {
            getDb().collection('products').deleteMany({}).then(() => {
                mongoDisconnect().then(() => {
                    done();
                });
            });
        });
    });