import User from "../models/User.js";
import { fileRemover } from "../utils/fileRemover.js";
import { uploadPicture } from "../middleware/uploadPictureMiddleware.js";


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



            //{ User profile picture update endpoint }//
const updateProfilePicture = async (req, res, next) => {
  try {
     // Configure multer middleware for handling profile picture upload
    const upload = uploadPicture.single("profilePicture");

    upload(req, res, async function (err) {  // Execute the file upload process
      if (err) {
        const error = new Error(
          "An unknown error occured when uploading " + err.message
        );
        next(error);
      } else {
        // Handle successful file upload

        // Check if a file was uploaded
        if (req.file) {
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;  // Remove the previous profile picture file, if it exists
          if (filename) {
            fileRemover(filename);
          }
          updatedUser.avatar = req.file.filename;  // Update the user's avatar with the new filename
          await updatedUser.save();  
          res.json({                        // Respond with the updated user details and JWT token
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        } else {
            // Handle the case where no file was uploaded
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();
          fileRemover(filename);      // Remove the previous profile picture file
          res.json({
            _id: updatedUser._id,       // Respond with the updated user details and JWT token
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};


// Export the user authentication and profile management functions
export { registerUser, loginUser, userProfile, updateProfile, updateProfilePicture } 