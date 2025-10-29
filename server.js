// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx49nzX0ZPJHfx_kD7tOnL3hqkx3J9HBGxSoMhGl7wRGs7_P3Hf9vSGO7T8CcWhZGgP/exec";

app.post("/submit", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to forward request" });
  }
});

app.listen(3000, () => console.log("Proxy server running on port 3000"));
