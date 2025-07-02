import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  plan: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'matured', 'withdrawn', 'penalized'], default: 'active' },
  penalty: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
}, { timestamps: true });

const Investment = mongoose.model('Investment', investmentSchema);
export default Investment; 