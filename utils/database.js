const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nodeshopdb:admin@cluster0.rweci.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });


module.exports = client