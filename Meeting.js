import { Schema, model } from 'mongoose';

const meetingSchema = new Schema({
  meetingId: {
    type: String,
    required: true,
    unique: true,
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      approvedToDraw: { type: Boolean, default: false },
      approvedToShareScreen: { type: Boolean, default: false },
    }
  ],
  isActive: {
    type: Boolean,
    default: true,
  }
});

export default model('Meeting', meetingSchema);
