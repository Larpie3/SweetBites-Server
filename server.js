import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
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
          animation: fadeIn 1.5s ease-in-out;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.2rem;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>SweetBites Proxy Server</h1>
        <p>All systems operational 🍰</p>
      </div>
    </body>
    </html>
  `);
});


app.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, orderType, message } = req.body;
    if (!name || !email || !phone || !orderType || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Replace this with your Google Apps Script Web App URL
    const GAS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

    const gasResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, orderType, message })
    });

    const gasData = await gasResponse.text(); // GAS usually returns plain text

    res.status(200).json({ success: true, message: 'Order sent to Google Sheet', gasData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
