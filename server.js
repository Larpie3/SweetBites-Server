import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Root route just for sanity check
app.get('/', (req, res) => {
  res.send('SweetBites Proxy Server is running.');
});

// Endpoint to receive order data and forward to Google Apps Script
app.post('/submit', async (req, res) => {
  const { name, email, phone, orderType, message } = req.body;
  if(!name || !email || !phone || !orderType || !message){
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbx49nzX0ZPJHfx_kD7tOnL3hqkx3J9HBGxSoMhGl7wRGs7_P3Hf9vSGO7T8CcWhZGgP/exec';
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, orderType, message })
    });

    if(response.ok){
      return res.status(200).json({ success: true, message: 'Order forwarded to Google Sheet' });
    } else {
      const text = await response.text();
      console.error('GAS error:', text);
      return res.status(500).json({ error: 'Failed to send order to Google Sheet' });
    }

  } catch(err){
    console.error('Proxy server error:', err);
    return res.status(500).json({ error: 'Server error s
