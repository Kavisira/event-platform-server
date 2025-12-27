import { auth } from "../config/firebase.js";

export const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 🔥 Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);

    // Attach user info to request
    req.user = decodedToken;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};
