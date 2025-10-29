import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/submit", async (req, res) => {
  try {
    const scriptURL = "https://script.google.com/macros/s/AKfycbx49nzX0ZPJHfx_kD7tOnL3hqkx3J9HBGxSoMhGl7wRGs7_P3Hf9vSGO7T8CcWhZGgP/exec";
    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error("Failed to send to Google Apps Script");
    }

    const result = await response.text();
    res.json({ success: true, message: "Sent to Google Script", result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ SweetBites proxy server is running");
});

app.listen(3000, () => console.log("Proxy server running on port 3000"));
