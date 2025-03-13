import cloudinary from "../lib/cloudinary.js"
import { getRecevierSocketId, io } from "../lib/socket.js"
import Msg from "../models/message.model.js"
import User from "../models/user.model.js"

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const filterUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password")
    res.status(200).json(filterUser)
  } catch (error) {
    console.log("Error in  getUsersForSidebar", error.message)
    res.status(500).json({ message: "internal server error" })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params
    const myId = req.user._id
    const messages = await Msg.find({
      $or: [
        { senderId: myId, reciverId: userToChatId },
        { senderId: userToChatId, reciverId: myId },
      ],
    })
    res.status(200).json(messages)
  } catch (error) {
    console.log("Error in  getMessage controller", error.message)
    res.status(500).json({ message: "internal server error" })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body
    const { id: reciverId } = req.params
    const senderId = req.user._id

    let imageUrl
    if (image) {
      //upload image to cloudinary
      const uploadRes = await cloudinary.uploader.upload(image)
      imageUrl = uploadRes.secure_url
    }

    const newMessage = new Msg({
      senderId,
      reciverId,
      text,
      image: imageUrl,
    })

    await newMessage.save()

    
    const receiverSocketId = getRecevierSocketId(reciverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }
    res.status(201).json(newMessage)
  } catch (error) {
    console.log("Error in  sendMessage controller", error.message)
    res.status(500).json({ message: "internal server error" })
  }
}
