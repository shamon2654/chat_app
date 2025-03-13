import { Image, Send, X } from "lucide-react"
import React, { useRef, useState } from "react"
import toast from "react-hot-toast"
import { useChatStore } from "../store/useChatStore"

const MessageInput = () => {
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputeRef = useRef(null)

  const { sendMessage } = useChatStore()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    const render = new FileReader()
    console.log(render)
    render.onloadend = () => {
      setImagePreview(render.result)
    }
    render.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputeRef.current) fileInputeRef.current.value = ""
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() && !imagePreview) return
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      })
      // clearform
      setText("")
      setImagePreview(null)
      if (fileInputeRef.current) {
        fileInputeRef.current.value = ""
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
        <div className="flex-1 flex  gap-2">
          <input
            type="text"
            className="input w-full input-bordered rounded-lg input-sm sm:input-md "
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            className="hidden"
            ref={fileInputeRef}
            accept="image/*"
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputeRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput
