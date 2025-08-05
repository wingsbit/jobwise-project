export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Normalize roles to lowercase
    const userRole = req.user?.role?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    console.log("🔍 Role Check:", {
      userRole: userRole || "No role",
      allowedRoles: normalizedAllowedRoles
    });

    if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
      console.warn("⛔ Access denied: Role not allowed for this action");
      return res.status(403).json({ msg: "Not authorized for this action" });
    }

    next();
  };
};
