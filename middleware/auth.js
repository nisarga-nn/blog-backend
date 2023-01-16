const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = await req.header("token");
  if (!token) {
    return res.json({ message: "Token does not exist" });
  } else {
    const secretkey = "someprivatekey";
    try {
      const verified = jwt.verify(token, secretkey);
      req.user = verified;
      next();
    } catch (err) {
      return res.send({ err });
    }
  }
};
