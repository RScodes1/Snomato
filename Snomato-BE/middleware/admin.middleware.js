

module.exports.isAdmin = (req, res, next) => {
  if (req.role !== "Admin") {
    return res.status(403).json({ msg: "Access denied. Admin only." });
  }
  next();
};
