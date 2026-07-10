import jwt from "jsonwebtoken";

// Dev fallback so the app runs after a clean clone; override in production.
export const JWT_SECRET = process.env.JWT_SECRET || "replog-dev-secret-change-me";

export function signToken(userId) {
  return jwt.sign({ uid: userId }, JWT_SECRET, { expiresIn: "30d" });
}

/** Require a valid Bearer token; attaches req.userId. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const { uid } = jwt.verify(token, JWT_SECRET);
    req.userId = uid;
    next();
  } catch {
    res.status(401).json({ error: "Session expired — please sign in again" });
  }
}
