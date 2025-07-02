import Chat from '../models/chat.js';
import User from '../models/user.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { message, room } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Optionally check for mute/ban here
    const chat = new Chat({
      user: user._id,
      username: user.username,
      message,
      room: room || 'global'
    });
    await chat.save();
    res.status(201).json({ message: 'Message sent', chat });
  } catch (err) {
    res.status(500).json({ message: 'Send failed', error: err.message });
  }
};

// Get recent messages for a room
export const getMessages = async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await Chat.find({ room: room || 'global' }).sort({ createdAt: -1 }).limit(100);
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

// Admin deletes a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Chat.findByIdAndDelete(id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
}; 