export function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user; // user is added by auth middleware after verifying JWT

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();
  };
}
