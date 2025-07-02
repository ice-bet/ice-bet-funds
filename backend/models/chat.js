import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  room: { type: String, default: 'global' },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // 24 hours
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat; 