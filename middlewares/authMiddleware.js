import JWT from "jsonwebtoken";
import createError from "../utils/Error.js";

// protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers?.authorization,
      process.env.JWT_SECRET_KEY
    );

    req.user = decode;
    next();
  } catch (error) {
    return next(createError(500, "Invalid token"));
  }
};
