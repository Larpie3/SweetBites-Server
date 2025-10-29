import express from "express"
import fetch from "node-fetch"
import cors from "cors"
import bodyParser from "body-parser"

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/submit", async (req, res) => {
  const scriptUrl = "https://script.google.com/macros/s/AKfycbx49nzX0ZPJHfx_kD7tOnL3hqkx3J9HBGxSoMhGl7wRGs7_P3Hf9vSGO7T8CcWhZGgP/exec"

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    })

    const data = await response.text()
    res.status(200).send({ success: true, message: "Form forwarded successfully", data })
  } catch (err) {
    res.status(500).send({ success: false, message: "Error forwarding form", error: err.message })
  }
})

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`))
