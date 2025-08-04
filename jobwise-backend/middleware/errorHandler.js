// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error("💥 Error:", err.stack || err);
    res.status(err.statusCode || 500).json({
      msg: err.message || "Internal Server Error",
    });
  };
  