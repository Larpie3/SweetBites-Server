import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCkxYnwFBOTO_vz6bkJJWM1tSatq4H6yeY",
  authDomain: "sweetbites-admin-console.firebaseapp.com",
  projectId: "sweetbites-admin-console",
  storageBucket: "sweetbites-admin-console.firebasestorage.app",
  messagingSenderId: "125142981711",
  appId: "1:125142981711:web:7ad785732b705597069e3a"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SweetBites Proxy</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #FFB347, #FFCC33);
          font-family: 'Poppins', sans-serif;
          color: #fff;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 2rem;
          background: rgba(0,0,0,0.2);
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        h1 { font-size: 2rem; margin: 0 0 .5rem 0; }
        p { margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>SweetBites Proxy Server</h1>
        <p>Connected to Web3Forms + Firebase Brought to by: Ralph Castanares</p>
      </div>
    </body>
    </html>
  `);
});

// Main submit route
app.post("/submit", async (req, res) => {
  try {
    const { name, email, phone, orderType, message, access_key, address } = req.body;

    if (!name || !email || !phone || !orderType || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Send to Web3Forms
    const params = new URLSearchParams();
    params.append("access_key", access_key || "f4a0d85e-a43d-4074-8220-5c4c74d09726");
    params.append("name", name);
    params.append("email", email);
    params.append("phone", phone);
    params.append("orderType", orderType);
    params.append("message", message);
    if (address) params.append("address", address);

    const web3res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const web3Text = await web3res.text();
    if (!web3res.ok) {
      return res.status(502).json({ success: false, message: "Web3Forms error", web3Response: web3Text });
    }

    // Save to Firebase
    const docRef = await addDoc(collection(db, "orders"), {
      name,
      email,
      phone,
      orderType,
      message,
      address: address || "",
      status: "Pending",
      createdAt: serverTimestamp()
    });

    res.status(200).json({
      success: true,
      message: "Order submitted successfully!",
      firebaseId: docRef.id,
      web3Response: web3Text
    });
  } catch (err) {
    console.error("Proxy error", err);
    res.status(500).json({ success: false, message: "Proxy server error" });
  }
});

app.listen(PORT, () => {
  console.log(`SweetBites Proxy running on port ${PORT}`);
});
