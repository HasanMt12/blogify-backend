import jsonwebtoken from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware for user authentication using JSON Web Tokens (JWT).
 * Verifies the user's authorization token and attaches the user object to the request.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {Error} If the authorization token is missing or invalid.
 */

export const userGuard = async (req, res, next) => {
    // Check if the request contains a valid authorization token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
       // Extract the token from the authorization header
      const token = req.headers.authorization.split(" ")[1];
      
      const { id } = jsonwebtoken.verify(token, process.env.JWT_SECRET);   // Verify the token using the secret key and get the user's ID
       
      // Fetch the user from the database by ID, excluding the password
      req.user = await User.findById(id).select("-password");
      
      next();// Continue to the next middleware
    } catch (error) {
      let err = new Error("Not authorized, Token failed");   // Handle token verification errors
      err.statusCode = 401;
      next(err);
    }
  } else {
    let error = new Error("Not authorized, No token");       // Handle missing or invalid authorization token
    error.statusCode = 401; 
    next(error);
  }
};



export const adminGuard = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    let error = new Error("Not authorized as an admn");
    error.statusCode = 401;
    next(error);
  }
};