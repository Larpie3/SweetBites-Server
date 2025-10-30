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
        }
        h1 { font-size: 2rem; margin: 0 0 .5rem 0; }
        p { margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>SweetBites Proxy Server</h1>
        <p>Proxy for Web3Forms — ready</p>
      </div>
    </body>
    </html>
  `);
});

app.post('/submit', async (req, res) => {
  try {
    const payload = req.body;
    const { name, email, phone, orderType, message, access_key } = payload;

    if (!name || !email || !phone || !orderType || !message || !access_key) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const params = new URLSearchParams();
    params.append('access_key', access_key);
    params.append('name', name);
    params.append('email', email);
    params.append('phone', phone);
    params.append('orderType', orderType);
    params.append('message', message);

    const web3res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const text = await web3res.text();
    if (!web3res.ok) {
      return res.status(502).json({ success: false, message: 'Web3Forms error', web3Status: web3res.status, web3Response: text });
    }

    return res.status(200).json({ success: true, message: 'Submitted to Web3Forms', web3Response: text });
  } catch (err) {
    console.error('Proxy error', err);
    return res.status(500).json({ success: false, message: 'Proxy server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
