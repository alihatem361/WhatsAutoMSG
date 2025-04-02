# WhatsAutoMSG

A Node.js application that uses UltraMSG API to send WhatsApp messages with text, video, and location.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with your UltraMSG credentials:
   ```
   ULTRAMSG_INSTANCE_ID=your_instance_id
   ULTRAMSG_API_TOKEN=your_api_token
   PORT=3000
   ```

3. Start the server:
   ```
   node index.js
   ```

## API Endpoints

### Send WhatsApp Message with Text, Video, and Location

**Endpoint:** `POST /api/send-whatsapp`

**Request Body:**
```json
{
  "phone": "1234567890",    // Required: Phone number with country code
  "message": "Hello there", // Optional: Text message
  "videoUrl": "https://example.com/video.mp4", // Optional: URL of video to send
  "latitude": 31.2357,      // Optional: Latitude for location
  "longitude": 29.9815,     // Optional: Longitude for location
  "address": "Alexandria, Egypt" // Optional: Address description for location
}
```

**Response:**
```json
{
  "success": true,
  "message": "WhatsApp message sent successfully"
}
```

## Error Handling

- 400 Bad Request: Missing required parameters
- 500 Internal Server Error: Failed to send WhatsApp message

## Note

You need to have a valid UltraMSG account and WhatsApp instance configured. Get your credentials from [UltraMSG](https://ultramsg.com/). 