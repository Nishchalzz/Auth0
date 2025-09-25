# Gmail Integration via Composio OAuth

A web application that allows users to authenticate through Google OAuth via Composio and send emails through their Gmail account.

## Features

- 🔐 Google OAuth authentication via Composio
- 📧 Send emails through Gmail integration
- 🎨 Clean and responsive UI
- 🚀 Real-time email sending with feedback

## Prerequisites

- Node.js (v14 or higher)
- Composio account and API key
- Gmail integration configured in Composio

## Setup

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update `.env` with your configuration:

```
COMPOSIO_API_KEY=your_composio_api_key_here
SESSION_SECRET=your_secure_session_secret_here
PORT=3001
```

### 3. Configure Composio

1. Sign up at [Composio](https://composio.dev)
2. Get your API key from the dashboard
3. Add Gmail integration in your Composio dashboard
4. Configure OAuth settings with these URLs:
   - **Redirect URL**: `http://localhost:3001/api/auth/callback`

### 4. Running the Application

Start both server and client:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Start server
npm run server

# Terminal 2 - Start client
npm run client
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## Usage

1. Open http://localhost:3000 in your browser
2. Click "Connect with Google" to authenticate via Composio
3. You'll be redirected to Google's OAuth consent screen
4. After authentication, you'll be redirected back to the dashboard
5. Use the email composer to send emails through your Gmail account

## API Endpoints

- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/callback` - Handle OAuth callback
- `GET /api/user` - Get current user session
- `POST /api/send-email` - Send email via Gmail
- `POST /api/logout` - Logout user

## Project Structure

```
├── server.js              # Express server with Composio integration
├── package.json           # Server dependencies
├── .env                   # Environment variables
├── client/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── components/
│   │   │   ├── Login.js   # Login component
│   │   │   ├── Dashboard.js # Dashboard container
│   │   │   └── EmailComposer.js # Email sending form
│   │   └── ...
│   └── package.json       # Client dependencies
└── README.md
```

## Troubleshooting

### Common Issues

1. **"composio-core not found"**: Make sure you're using `@composio/core` package
2. **OAuth callback fails**: Verify your redirect URL in Composio dashboard
3. **Email sending fails**: Ensure Gmail integration is properly configured in Composio
4. **CORS errors**: Check that the frontend is running on port 3000 and backend on 3001

### Environment Variables

- `COMPOSIO_API_KEY`: Your Composio API key (required)
- `SESSION_SECRET`: Secure string for session encryption (required)
- `PORT`: Server port (optional, defaults to 3001)

## Security Notes

- Never commit your `.env` file to version control
- Use a strong, random session secret in production
- Consider implementing CSRF protection for production use
- Use HTTPS in production environments

## License

MIT License

hi
