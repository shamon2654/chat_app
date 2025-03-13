import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized -no token Provided" })
    }
    const decorded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decorded) {
        return res.status(401).json({ message: "Unauthorized -no token" })
      }
      
      const user = await User.findById(decorded.userid).select("-password")

      if (!user) {
          return res.status(404).json({message:"User not found"})
      }
      
      req.user = user
      next()

  } catch (error) {
    console.log("Error in middleware controller", error.message)
    res.status(500).json({ message: "internal server error" })
  }
}
