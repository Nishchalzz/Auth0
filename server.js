const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { ComposioToolSet } = require('@composio/core');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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

const composio = new ComposioToolSet({ apiKey: process.env.COMPOSIO_API_KEY });

app.get('/api/auth/google', async (req, res) => {
  try {
    const authUrl = await composio.getAuthUrl({
      integrationId: 'gmail',
      redirectUrl: 'http://localhost:3001/api/auth/callback'
    });

    res.json({ authUrl });
  } catch (error) {
    console.error('Error getting auth URL:', error);
    res.status(500).json({ error: 'Failed to get auth URL' });
  }
});

app.get('/api/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;

    const connection = await composio.initiateConnection({
      integrationId: 'gmail',
      authConfig: { code }
    });

    req.session.connectionId = connection.connectionId;
    req.session.userEmail = connection.connectedAccountId;

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

    const result = await composio.executeAction({
      actionName: 'gmail_send_email',
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
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});