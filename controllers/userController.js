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

    return res.status(201).json({   // Respond with user details and generated JWT token 
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};


       //{ User login endpoint }//
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;      // Extract login credentials from request body

    let user = await User.findOne({ email });   // Find the user based on the provided email

    if (!user) {
      throw new Error("Email not found");
    }
 // Compare the provided password with the stored password
    if (await user.comparePassword(password)) {
      return res.status(201).json({  // Respond with user details and generated JWT token
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
        token: await user.generateJWT(),
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

        //{ User profile retrieval endpoint }//
const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id); // Find the user based on the authenticated user's ID

    if (user) {
      return res.status(201).json({  // Respond with user details
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
      });
    } else {
      let error = new Error("User not found");   // If user not found, respond with a 404 error
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
          //{ User profile update endpoint  }//
const updateProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id); // Find the user based on the authenticated user's ID

    if (!user) {
      throw new Error("User not found");
    }

    user.name = req.body.name || user.name; // Update user information based on request body
    user.email = req.body.email || user.email;
    // Validate and update the password if provided
    if (req.body.password && req.body.password.length < 6) {  
      throw new Error("Password length must be at least 6 character");
    } else if (req.body.password) {
      user.password = req.body.password;
    }
      
    // Save the updated user profile
    const updatedUserProfile = await user.save();

    res.json({                          // Respond with the updated user details and JWT token
      _id: updatedUserProfile._id,
      avatar: updatedUserProfile.avatar,
      name: updatedUserProfile.name,
      email: updatedUserProfile.email,
      verified: updatedUserProfile.verified,
      admin: updatedUserProfile.admin,
      token: await updatedUserProfile.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

// Export the user authentication and profile management functions
export { registerUser, loginUser, userProfile, updateProfile } 