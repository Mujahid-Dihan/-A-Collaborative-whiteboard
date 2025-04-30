const Meeting = require('../models/Meeting').default;
const User = require('../models/User').default;
const { v4: uuidv4 } = require('uuid');

exports.createMeeting = async (req, res) => {
  const userId = req.body.userId;

  try {
    const existing = await Meeting.findOne({ isActive: true });
    if (existing) {
      return res.status(400).json({ message: 'A meeting is already active.' });
    }

    const meetingId = uuidv4();

    const meeting = await Meeting.create({
      meetingId,
      host: userId,
      participants: [],
    });

    res.status(201).json({
      message: 'Meeting created',
      meetingId: meeting.meetingId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create meeting', error: err.message });
  }
};

exports.joinMeeting = async (req, res) => {
  const { userId, meetingId } = req.body;

  try {
    const meeting = await Meeting.findOne({ meetingId, isActive: true });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    const alreadyIn = meeting.participants.find(p => p.user.toString() === userId);
    if (!alreadyIn) {
      meeting.participants.push({ user: userId });
      await meeting.save();
    }

    res.status(200).json({ message: 'Joined meeting successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to join meeting', error: err.message });
  }
};

exports.endMeeting = async (req, res) => {
  const { meetingId, userId } = req.body;

  try {
    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    if (meeting.host.toString() !== userId) {
      return res.status(403).json({ message: 'Only host can end the meeting' });
    }

    meeting.isActive = false;
    await meeting.save();

    res.status(200).json({ message: 'Meeting ended' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to end meeting', error: err.message });
  }
};
