export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ msg: "Not authorized for this action" });
      }
      next();
    };
  };
  