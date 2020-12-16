const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nodeshopdb:admin@cluster0.rweci.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

let _db;

const mongoConnect = () => {
    return client.connect()
        .then(res => _db = res.db())
        .catch(console.err);
}

const getDb = () => {
    if (_db) {
        return _db;
    }

    throw 'Database not connected';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;