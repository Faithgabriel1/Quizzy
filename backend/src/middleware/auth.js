const jwt = require("jsonwebtoken");

// Blocks the request unless it carries a valid login token.
exports.verifyToken = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Please log in to continue" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Your session has expired. Please log in again." });
  }
};

// Lets only admins through for the given HTTP methods (for example ["POST", "PUT", "DELETE"]).
// With rootOnly = true it only applies to the list route ("/"), not to "/:id".
exports.requireAdminFor = (methods, rootOnly = false) => (req, res, next) => {
  const applies = methods.includes(req.method) && (!rootOnly || req.path === "/");

  if (applies && (!req.user || req.user.role !== "admin")) {
    return res.status(403).json({ success: false, message: "Admins only" });
  }

  next();
};
