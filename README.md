# WhatsAutoMSG

An Express.js application that leverages UltraMSG API to send WhatsApp messages with text, video, and location information.

![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

## Features

- Send text messages via WhatsApp
- Send video content (including YouTube links)
- Share location information
- API rate limiting for security
- Environment-based configuration
- Easy to integrate with other applications

## Prerequisites

- Node.js (v14 or higher)
- WhatsApp account connected to UltraMSG
- UltraMSG account credentials (Instance ID and API Token)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alihatem361/WhatsAutoMSG.git
   cd WhatsAutoMSG
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your UltraMSG credentials:
   ```
   ULTRAMSG_INSTANCE_ID=your_instance_id
   ULTRAMSG_API_TOKEN=your_api_token
   PORT=3000
   ```

## Usage

### Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### API Endpoints

#### Send WhatsApp Message with Text, Video, and Location

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

## Postman Integration

This project includes Postman collection and environment files for easy API testing:

1. Import `WhatsAutoMSG.postman_collection.json` and `WhatsAutoMSG.postman_environment.json` into Postman
2. Configure environment variables (baseUrl, instanceId, apiToken)
3. Use the pre-configured requests to test the API

For detailed instructions, see [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md).

## Error Handling

- 400 Bad Request: Missing or invalid parameters
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server-side issues

## Security Features

- Rate limiting to prevent abuse
- Environment variable-based secrets
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the package.json file for details.

## Note

You need to have a valid UltraMSG account and WhatsApp instance configured. Get your credentials from [UltraMSG](https://ultramsg.com/). 