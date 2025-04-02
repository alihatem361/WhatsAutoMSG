const express = require("express");
const bodyParser = require("body-parser");
const UltraMsgClient = require("ultramsg-whatsapp-api");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const fetch = require("node-fetch");
const youtubedl = require("youtube-dl-exec");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Validate environment variables
const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
const apiToken = process.env.ULTRAMSG_API_TOKEN;

if (!instanceId || !apiToken) {
  throw new Error(
    "Missing required environment variables: ULTRAMSG_INSTANCE_ID and/or ULTRAMSG_API_TOKEN"
  );
}

// Set up UltraMSG client - passing instance_id and token directly
const ultraMsgClient = new UltraMsgClient(instanceId, apiToken);

// Helper function to validate phone number
function validatePhoneNumber(phone) {
  // Remove any non-digit characters
  const cleanedPhone = phone.replace(/\D/g, "");

  // Check if the number is valid (between 10-15 digits)
  if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
    return false;
  }

  return cleanedPhone;
}

// Helper function to validate and process video URL
async function processVideoUrl(url) {
  if (!url) return null;

  // Check if it's a YouTube URL
  if (url.includes("youtu.be") || url.includes("youtube.com")) {
    try {
      // Get direct video URL using youtube-dl
      const videoInfo = await youtubedl(url, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        preferFreeFormats: true,
        format: "best[ext=mp4]",
      });

      if (videoInfo && videoInfo.url) {
        return videoInfo.url;
      }
      console.log("Couldn't get direct video URL from YouTube");
      return null;
    } catch (error) {
      console.error("Error processing YouTube URL:", error);
      return null;
    }
  }

  // For non-YouTube URLs, validate if it's a video file
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("video/")) {
      console.log("URL does not point to a valid video file");
      return null;
    }
    return url;
  } catch (error) {
    console.error("Error validating video URL:", error);
    return null;
  }
}

// API endpoint to send WhatsApp message with text, video and location
app.post("/api/send-whatsapp", async (req, res) => {
  try {
    const { phone, message, videoUrl, latitude, longitude, address } = req.body;

    // Validate required parameters
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Validate and clean phone number
    const validatedPhone = validatePhoneNumber(phone);
    if (!validatedPhone) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    // Combine message with video URL if both exist
    let finalMessage = message || "";
    if (videoUrl) {
      finalMessage = finalMessage + (finalMessage ? "\n\n" : "") + videoUrl;
    }

    // Send text message if provided
    if (finalMessage) {
      try {
        await ultraMsgClient.sendChatMessage(validatedPhone, finalMessage);
      } catch (error) {
        console.error("Error sending text message:", error);
        throw new Error("Failed to send text message");
      }
    }

    // Send location if coordinates are provided
    if (latitude && longitude) {
      try {
        await ultraMsgClient.sendLocationMessage(
          validatedPhone,
          address || "Shared Location",
          parseFloat(latitude),
          parseFloat(longitude)
        );
      } catch (error) {
        console.error("Error sending location:", error);
        throw new Error("Failed to send location");
      }
    }

    res.status(200).json({
      success: true,
      message: "WhatsApp message sent successfully",
    });
  } catch (error) {
    console.error("Error in send-whatsapp endpoint:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send WhatsApp message",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
