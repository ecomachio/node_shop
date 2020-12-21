import { Db, MongoClient } from 'mongodb';
const uri = "mongodb+srv://nodeshopdb:admin@cluster0.rweci.mongodb.net/nodeshopdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

let _db: Db;

export const mongoConnect = () => {
    return client.connect()
        .then(res => _db = res.db())
        .catch(console.log);
}

export const getDb = () => {
    if (_db) {
        return _db;
    }

    throw new Error('Database not connected');
}
