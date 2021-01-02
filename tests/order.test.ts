import Product from '../src/models/product';
import { expect } from 'chai';
import 'mocha';
import { getDb, mongoConnect, mongoDisconnect } from '../src/utils/database';
import * as chai from 'chai';
import chaiThings from 'chai-things';
import { InsertOneWriteOpResult, UpdateWriteOpResult } from 'mongodb';
import User from '../src/models/user';

chai.should();
chai.use(chaiThings);

describe('Order tests', function () {
    // tslint:disable-next-line: only-arrow-functions
    before(async function () {
        await mongoConnect("mongodb+srv://nodeshopdb:admin@cluster0.rweci.mongodb.net/nodeshopdb_test?retryWrites=true&w=majority")
        const products: Product[] = [];
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
        let lastProduct: any = {};

        for (const p of products) {
            lastProduct = (await p.save()) as InsertOneWriteOpResult<any>;
        }

        await getDb().collection('users').insertOne({
            name: "test",
            email: "test@hotmail.com",
            cart: {
                items: [{ _id: lastProduct.ops[0]._id, quantity: 3 }],
                totalPrice: 17.4
            }
        });

    })
    // tslint:disable-next-line: only-arrow-functions
    it('should create a new order', async function () {
        const u = (await getDb().collection('users').find({}).toArray())[0];
        const user = new User(u.name, u.email, u.cart, u._id);
        console.log("cart", user.cart)
        const result = await user.addOrder();

        console.log(result.ops);

        expect(result.result.ok).to.equal(1);
        result.ops.should.all.have.property('_id');
        result.ops.should.include.something.that.have.property('order')
        result.ops[0].order.should.have.deep.property('items')
    })
    // tslint:disable-next-line: only-arrow-functions
    after(function (done) {
        getDb().collection('users').deleteMany({})
            .then(() => getDb().collection('orders').deleteMany({}))
            .then(() => mongoDisconnect())
            .then(() => done());
    })
})
