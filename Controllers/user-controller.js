const User = require("../Models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRETE = process.env.JWT_SECRETE || "alex123";


// admin login
 const adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === "admin@gmail.com" && password === "admin123") {
      const admin_token = jwt.sign({ email }, process.env.JWT_SECRETE, {
        expiresIn: "3d",
      });
      res.status(200).json({ email, admin_token });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// -------------------registration process-----------
 const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      username,
      email,
      password: hashPassword,
     
    });
    if (result) return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------login processs-------------
 const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const user_token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE, {
      expiresIn: "3d",
    });

    return res.status(200).json({
      _id: user.id,
      name: user.username,
      email: user.email,
      image: user.image,
      cartItems: user.cartItems.map((item) => ({ pid: item.product })),
      user_token: user_token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


//--------------------logout user-------------
const logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
};


// get all users
const getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) return res.status(400).json({ message: "User not found" });
    
    return res.status(200).json({message: "Users successfully",user});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// delete a user
const deleteUser=async(req, res)=>{
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" })
    
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });

  }

}


// get user profile
 const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



// updateprofile
 const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    await User.findByIdAndUpdate(
      req.user.id,
      {
        username,
        email,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};






module.exports = {
  userRegister,
  userLogin,
  adminLogin,
  logout,
  deleteUser,
  getAllUser,
  getUserProfile,
  updateUserProfile,

};
