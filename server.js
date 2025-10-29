import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('SweetBites Proxy Server is running.');
});

app.post('/submit', async (req, res) => {
  const { name, email, phone, orderType, message } = req.body;

  if (!name || !email || !phone || !orderType || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const GAS_URL = 'https://script.google.com/macros/s/YOUR_GAS_DEPLOY_ID/exec';
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, orderType, message })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('GAS error:', text);
      return res.status(500).json({ error: 'Failed to send order to Google Sheet' });
    }

    return res.status(200).json({ success: true, message: 'Order forwarded to Google Sheet' });

  } catch (err) {
    console.error('Proxy server error:', err);
    return res.status(500).json({ error: 'Server error sending order' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

