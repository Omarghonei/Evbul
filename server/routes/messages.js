import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: -1 }).populate('senderId receiverId', 'name role');

    const partnersMap = new Map();
    messages.forEach(m => {
      const partner = m.senderId._id.toString() === userId ? m.receiverId : m.senderId;
      if (!partnersMap.has(partner._id.toString())) {
        partnersMap.set(partner._id.toString(), {
          user: partner,
          lastMessage: m.text,
          date: m.createdAt
        });
      }
    });

    res.json(Array.from(partnersMap.values()));
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

router.post('/', async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const msg = new Message({
      senderId: req.user.id,
      receiverId,
      text
    });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

export default router;
