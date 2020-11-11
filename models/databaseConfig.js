const MongoClient = require('mongodb').MongoClient;


//db config
const URL = "mongodb+srv://demo:0000@cluster0.46um3.mongodb.net/<dbname>?retryWrites=true&w=majority";
const conn = MongoClient.connect(URL, { useUnifiedTopology: true });

module.exports = {
    url: URL,
    conn
}