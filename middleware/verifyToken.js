const jwt = require("jsonwebtoken");
const JWT_SECRETE = process.env.JWT_SECRETE || "alex123";

 const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token,JWT_SECRETE, (err, user) => {
      if (err) return res.status(403).json({ message: "Token is not valid" });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "Access Denied No Token,Login To Add Items" });
    // return res.status(401).json({ message: "Access Denied, No Token" });
  }
};

 const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.email === "admin@gmail.com") {
      next();
    } else {
      res.status(403).json({ message: "You are not admin" });
    }
  });
};
module.exports = {verifyToken,verifyAdmin}