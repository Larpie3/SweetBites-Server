import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ----------------- Firebase Setup -----------------
const firebaseConfig = {
  apiKey: 'AIzaSyCkxYnwFBOTO_vz6bkJJWM1tSatq4H6yeY',
  authDomain: 'sweetbites-admin-console.firebaseapp.com',
  projectId: 'sweetbites-admin-console',
  storageBucket: "sweetbites-admin-console.firebasestorage.app",
  messagingSenderId: "125142981711",
  appId: "1:125142981711:web:7ad785732b705597069e3a"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ----------------- Routes -----------------
app.get('/', (req, res) => {
  res.send('SweetBites Proxy Server — alive ✅');
});

app.post('/submit', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      orderType,
      message,
      address = '',
      notes = '',
      access_key
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !orderType || !message || !access_key) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // 1️⃣ Send to Web3Forms
    const web3Params = new URLSearchParams();
    web3Params.append('access_key', access_key);
    web3Params.append('name', name);
    web3Params.append('email', email);
    web3Params.append('phone', phone);
    web3Params.append('orderType', orderType);
    web3Params.append('message', message);
    if (address) web3Params.append('address', address);
    if (notes) web3Params.append('notes', notes);

    const web3res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: web3Params
    });

    const web3Text = await web3res.text();
    if (!web3res.ok) {
      return res.status(502).json({
        success: false,
        message: 'Web3Forms submission failed',
        status: web3res.status,
        response: web3Text
      });
    }

    // 2️⃣ Save to Firebase Firestore
    try {
      await addDoc(collection(db, 'orders'), {
        name,
        email,
        phone,
        orderType,
        message,
        address,
        notes,
        timestamp: serverTimestamp()
      });
      console.log('✅ Order saved to Firebase:', { name, email });
    } catch (firebaseErr) {
      console.error('❌ Firebase error:', firebaseErr);
      return res.status(500).json({
        success: false,
        message: 'Firebase save failed',
        error: firebaseErr.message
      });
    }

    // 3️⃣ Return success
    res.status(200).json({
      success: true,
      message: 'Order submitted to Web3Forms and Firebase',
      web3Response: web3Text
    });

  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ----------------- Start Server -----------------
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
