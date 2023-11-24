import User from "../models/User.js";

              //{ User registration endpoint }//
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;  // Extract user information from request body
   
    let user = await User.findOne({ email });    // check whether the user exists or not
    if (user) {
      throw new Error("User have already registered");
    }

    // creating a new user
    user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({   // Respond with user details 
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: null,
    });
  } catch (error) {
    next(error);
  }
};


// Export the user authentication and profile management functions
export { registerUser } 