const express = require("express");
const { connection } = require("./connection");
const app = express();
const userRoutes = require("./routes/user");
const blogsRoutes = require("./routes/blog");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/blog", blogsRoutes);
app.use("*", (req, res) => {
  res.status(400).json({ message: "Route does not exist" });
});

const PORT = 4000;

app.listen(PORT, async () => {
  const { db } = await connection();
  const dbs = await db.listCollections().toArray();
  if (dbs.length) {
    console.log(`App running on port ${PORT}`);
  }
});
