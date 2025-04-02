const express = require("express");
const bodyParser = require("body-parser");
const UltraMsgClient = require("ultramsg-whatsapp-api");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up UltraMSG client
const ultraMsgClient = new UltraMsgClient({
  instanceId: process.env.ULTRAMSG_INSTANCE_ID,
  token: process.env.ULTRAMSG_API_TOKEN,
});

// API endpoint to send WhatsApp message with text, video and location
app.post("/api/send-whatsapp", async (req, res) => {
  try {
    const { phone, message, videoUrl, latitude, longitude, address } = req.body;

    // Validate required parameters
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required" });
    }

    // Send text message if provided
    if (message) {
      await ultraMsgClient.sendMessage({
        to: phone,
        body: message,
      });
    }

    // Send video if URL is provided
    if (videoUrl) {
      await ultraMsgClient.sendVideoUrl({
        to: phone,
        url: videoUrl,
        caption: "Video Message",
      });
    }

    // Send location if coordinates are provided
    if (latitude && longitude) {
      await ultraMsgClient.sendLocation({
        to: phone,
        lat: latitude,
        lng: longitude,
        address: address || "Shared Location",
      });
    }

    res.status(200).json({
      success: true,
      message: "WhatsApp message sent successfully",
    });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send WhatsApp message",
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
