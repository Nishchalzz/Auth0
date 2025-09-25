const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { Composio } = require('@composio/core');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

app.get('/api/auth/google', async (req, res) => {
  try {
    // For demo purposes with placeholder API key, return a mock auth URL
    if (process.env.COMPOSIO_API_KEY === 'demo_api_key_placeholder') {
      return res.json({
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=demo&redirect_uri=http://localhost:3002/api/auth/callback&response_type=code&scope=https://www.googleapis.com/auth/gmail.send',
        demo: true
      });
    }

    const connectionRequest = await composio.connectedAccounts.initiate({
      userId: 'user_' + Date.now(),
      integrationId: 'gmail',
      callbackUrl: 'http://localhost:3002/api/auth/callback'
    });

    res.json({ authUrl: connectionRequest.redirectUrl });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).json({ error: 'Failed to get auth URL. Please check your Composio API key.' });
  }
});

app.get('/api/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;

    // For demo purposes with placeholder API key
    if (process.env.COMPOSIO_API_KEY === 'demo_api_key_placeholder') {
      req.session.connectionId = 'demo_connection_' + Date.now();
      req.session.userEmail = 'demo@example.com';
      return res.redirect('http://localhost:3000/dashboard');
    }

    // In a real implementation, you'd wait for the connection to complete
    // const connectedAccount = await connectionRequest.waitForConnection();
    // req.session.connectionId = connectedAccount.id;
    // req.session.userEmail = connectedAccount.connectedAccountId;

    res.redirect('http://localhost:3000/dashboard');
  } catch (error) {
    console.error('Error in auth callback:', error);
    res.redirect('http://localhost:3000?error=auth_failed');
  }
});

app.get('/api/user', (req, res) => {
  if (req.session.connectionId) {
    res.json({
      isAuthenticated: true,
      email: req.session.userEmail,
      connectionId: req.session.connectionId
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    if (!req.session.connectionId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { to, subject, body } = req.body;

    // For demo purposes with placeholder API key
    if (process.env.COMPOSIO_API_KEY === 'demo_api_key_placeholder') {
      return res.json({
        success: true,
        result: {
          message: 'Demo email sent successfully!',
          to: to,
          subject: subject,
          demo: true
        }
      });
    }

    const result = await composio.tools.execute({
      toolName: 'gmail_send_email',
      connectionId: req.session.connectionId,
      params: {
        to_email: to,
        subject: subject,
        body: body
      }
    });

    res.json({ success: true, result });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please check your configuration.' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});