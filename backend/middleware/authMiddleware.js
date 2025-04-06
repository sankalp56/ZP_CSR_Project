const jwt = require("jsonwebtoken");
const User = require("../model/user");

// Middleware to verify token and extract user info
// exports.authenticate = async (req, res, next) => {
//     try {
//         const token = req.header("Authorization")?.split(" ")[1];
//         if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Attach user details to request object
//         next();
//     } catch (error) {
//         res.status(401).json({ error: "Invalid token." });
//     }
// };

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "No token, authorization denied." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔴 Fetch full user details, including isVerified
        const user = await User.findById(decoded.userId).select("-passwordHash");

        if (!user) return res.status(404).json({ error: "User not found." });

        req.user = user; // Attach full user object to request
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token." });
    }
};

// Middleware to check role-based access
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied. Insufficient permissions." });
        }
        next();
    };
};
