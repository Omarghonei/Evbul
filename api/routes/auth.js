import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'Bu e-posta zaten kayıtlı.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'evbul_fallback_key', { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Geçersiz e-posta veya şifre.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Geçersiz e-posta veya şifre.' });

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'evbul_fallback_key', { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

export const protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Yetki reddedildi. Token yok.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'evbul_fallback_key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token geçersiz veya süresi dolmuş.' });
  }
};

export default router;
