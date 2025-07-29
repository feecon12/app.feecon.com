import { connectDB } from "../../utils/db";
import Message from "../../models/Message";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    return res
      .status(201)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
