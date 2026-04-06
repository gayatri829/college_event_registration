const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ── MongoDB Connection ──────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ── Schema & Model ──────────────────────────────────────────────
const memberSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  class: { type: String, required: true, trim: true },
});

const registrationSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true, lowercase: true },
    members:  {
      type: [memberSchema],
      validate: {
        validator: (arr) => arr.length === 5,
        message: "Exactly 5 team members are required.",
      },
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);

// ── Routes ──────────────────────────────────────────────────────

// POST /api/register  — submit a new team
app.post("/api/register", async (req, res) => {
  try {
    const { teamName, email, members } = req.body;

    if (!teamName || !email || !Array.isArray(members) || members.length !== 5) {
      return res.status(400).json({
        success: false,
        message: "teamName, email, and exactly 5 members are required.",
      });
    }

    // Check for duplicate team name
    const existing = await Registration.findOne({
      teamName: new RegExp(`^${teamName}$`, "i"),
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A team with this name is already registered.",
      });
    }

    const registration = await Registration.create({ teamName, email, members });
    res.status(201).json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/registrations  — fetch all registrations (admin view)
app.get("/api/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/registrations/:id  — fetch single registration
app.get("/api/registrations/:id", async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: "Not found." });
    }
    res.json({ success: true, data: registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/registrations/:id  — remove a registration
app.delete("/api/registrations/:id", async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Registration deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
