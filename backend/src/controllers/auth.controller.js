import cloudinary from "../lib/cloudinary.js"
import { generateTokens } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "all fildes are required" })
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" })
    }
    const user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: "user already exists" })
    //has password
    const salt = await bcrypt.genSalt(10)
    const hashedPswrd = await bcrypt.hash(password, salt)
    const newUser = new User({
      fullName,
      email,
      password: hashedPswrd,
    })
    if (newUser) {
      // gernate jwt token
      generateTokens(newUser._id, res)
      await newUser.save()
      res.status(200).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      })
    } else {
      res.status(400).json({ message: "invalid user data" })
    }
  } catch (error) {
    console.log("Error in signup controller", error.message)
    res.status(500).json({ message: "internal server error" })
  }
}
export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res.status(400).json({ message: " Enter the credentials" })
    }
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(400)
        .json({ message: "user not found , Enter correct credentials" })
    }
    const isPassword = await bcrypt.compare(password, user.password)
    if (!isPassword) {
      return res.status(400).json({ message: "invalid credentials" })
    }

    generateTokens(user._id, res)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.log("Error in signup controller", error.message)
    res.status(500).json({ message: "internal server error" })
  }
}
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Loggout successfuly" })
  } catch (error) {
    console.log("Error in login controller", error.message)
    res.status(500).json({ message: "internal server error" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id
    if (!profilePic) {
      return res.status(400).json({ message: "profile Pic  is required" })
    }

      const uploadRes = await cloudinary.uploader.upload(profilePic)
      console.log(uploadRes)
      const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadRes.secure_url }, { new: true })
      
      res.status(200).json(updateUser)
  } catch (error) {
    console.log("Error in  update profile", error)
    res.status(500).json({ message: "internal server error" })
  }
}


export const checkAuth = async (req, res) => {
    try {
        
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in  check controller", error.message)
        res.status(500).json({ message: "internal server error" })
    }
}
