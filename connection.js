const { MongoClient } = require("mongodb");

const connection = async () => {
  const client = MongoClient.connect(
    "mongodb+srv://nisarga:mongo123@cluster0.r7xlq6g.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = (await client).db("blog");
  return { db };
};

module.exports = { connection };
