import { Db, MongoClient } from 'mongodb';
let _db: Db;
let _client: MongoClient;

export const buildClient = (uri: string) => {
    _client = new MongoClient(uri, { useNewUrlParser: true });
    return null;
}

export const mongoConnect = (uri: string) => {
    buildClient(uri);
    return _client.connect()
        .then(res => _db = res.db())
        .catch(console.log);
}

export const mongoDisconnect = () => {
    return _client.close();
}

export const getDb = () => {
    if (_db) {
        return _db;
    }

    throw new Error('Database not connected');
}
