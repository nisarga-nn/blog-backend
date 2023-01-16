const { ObjectId } = require("bson");
const express = require("express");
const verify = require("../middleware/auth");
const router = express.Router();
const { connection } = require("../connection");

//Getting all blogs
router.get("/all", verify, async (req, res) => {
  const { db } = await connection();
  const blogs = await db.collection("blog").find({}).toArray();
  if (!blogs) {
    return res.json({ message: "No blogs were found" });
  } else {
    return res.json({ message: "Blogs found", blogs });
  }
});

//Creating a blog
router.post("/add", verify, async (req, res) => {
  const { db } = await connection();
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.json({ message: "Please fill all the required properties" });
  } else {
    const blogExists = await db.collection("blog").findOne({ title:title});
    if (blogExists) {
      return res.json({
        message: "Blog with same name exists, Please enter another name",
        isSuccess: false,
      });
    } else {
      await db.collection("blog").insertOne({ title, content, author });
      return res.json({ message: "New blog was created", isSuccess: true });
    }
  }
});

//Updating a blog
router.put("/edit/:id", verify, async (req, res) => {
  const { db } = await connection();
  const id = req.params.id;
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.json({ message: "Please enter all the required properties" });
  } else {
    const blogExists = await db
      .collection("blog")
      .findOne({ _id: ObjectId(id) });
    if (!blogExists) {
      return res.json({ message: "Blog does not exist", isSuccess: false });
    } else {
      await db
        .collection("blog")
        .updateOne({ _id: ObjectId(id) }, { $set: { ...req.body } });
      return res.json({ message: "Blog edited successfully", isSuccess: true });
    }
  }
});

//Deleting a blog
router.delete("/delete/:id", verify, async (req, res) => {
  const { db } = await connection();
  const id = req.params.id;
  const blogExists = await db.collection("blog").findOne({ _id: ObjectId(id) });
  if (!blogExists) {
    return res.json({ message: "Blog does not exist", isSuccess: false });
  } else {
    await db.collection("blog").deleteOne({ _id: ObjectId(id) });
    return res.json({
      message: "Blog was deleted successfully",
      isSuccess: true,
    });
  }
});

//Get a single blog
router.get("/get/:id", verify, async (req, res) => {
  const { db } = await connection();
  const id = req.params.id;
  const blogExists = await db.collection("blog").findOne({ _id: ObjectId(id) });
  if (!blogExists) {
    return res.json({ message: "Blog does not exist", isSuccess: false });
  } else {
    return res.json({ message: "Blog found", isSuccess: true });
  }
});

module.exports = router;
