import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import Listing from './models/Listing.js';
import User from './models/User.js';
import authRoutes, { protect } from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import messageRoutes from './routes/messages.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', protect, uploadRoutes);
app.use('/api/messages', protect, messageRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.log('⚠️ DİKKAT: .env dosyasında MONGO_URI bulunamadı!');
  console.log('Lütfen kök dizinde .env dosyası oluşturup MongoDB bağlantı adresinizi ekleyin.');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Başarıyla Bağlandı!'))
    .catch(err => console.error('❌ MongoDB Bağlantı Hatası:', err));
}

// REST API Routes using Mongoose
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    // Map _id to id so frontend doesn't break
    const formatted = listings.map(l => ({...l.toObject(), id: l._id.toString()}));
    res.json(formatted);
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({error: 'İlan bulunamadı'});
    res.json({...listing.toObject(), id: listing._id.toString()});
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

app.post('/api/listings', protect, async (req, res) => {
  try {
    // Attach current user as owner
    if (req.user) req.body.owner = req.user.id;
    const newListing = new Listing({
      ...req.body,
      // If price is string from frontend, mongoose casts it to Number automatically
    });
    await newListing.save();
    
    const formatted = {...newListing.toObject(), id: newListing._id.toString()};
    io.emit('NEW_LISTING', formatted); // Real-time Update Broadcast
    res.status(201).json(formatted);
  } catch(err) {
    res.status(400).json({error: err.message});
  }
});

app.put('/api/listings/:id', protect, async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!updated) return res.status(404).json({error: 'İlan bulunamadı'});
    
    const formatted = {...updated.toObject(), id: updated._id.toString()};
    io.emit('UPDATE_LISTING', formatted); // Real-time Update Broadcast
    res.json(formatted);
  } catch(err) {
    res.status(400).json({error: err.message});
  }
});

app.delete('/api/listings/:id', protect, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    io.emit('DELETE_LISTING', req.params.id); // Real-time Delete Broadcast
    res.json({ success: true });
  } catch(err) {
    res.status(400).json({error: err.message});
  }
});

// Real-time Chat & WebSockets
io.on('connection', (socket) => {
  console.log(`[Socket] Müşteri bağlandı: ${socket.id}`);
  
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('send_message', (data) => {
    io.to(data.receiverId).emit('receive_message', data.msgData);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Müşteri ayrıldı: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Evbul Backend API ve WebSockets ${PORT} portunda çalışıyor.`);
});
