import Product from '../src/models/product';
import { expect } from 'chai';
import 'mocha';
import { getDb, mongoConnect, mongoDisconnect } from '../src/utils/database';
import * as chai from 'chai';
import chaiThings from 'chai-things';
import { InsertOneWriteOpResult, UpdateWriteOpResult } from 'mongodb';

chai.should();
chai.use(chaiThings);
