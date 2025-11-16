const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.tokenSecretKey);
    req.userID = decoded.userID;
    req.role = decoded.role;   // IMPORTANT
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
  }
};

module.exports = { auth };
