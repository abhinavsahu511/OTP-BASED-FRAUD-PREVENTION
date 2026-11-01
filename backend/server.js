const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 8000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

app.use(express.json());
app.use(cors());

app.post(['/send-message', '/api/send-message'], async (req, res) => {
  const { phoneNumber, otp } = req.body;

  const baseUrl = 'https://otp-based-fraud.web.app/otp';
  const otpLink = otp ? `${baseUrl}?code=${otp}` : baseUrl;
  const message = `Hi - Click here to view your secure OTP: ${otpLink}`;

  try {
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phoneNumber,
          From: fromNumber,
          Body: message,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error('Twilio API error:', data);
      return res.status(response.status).send({ error: data.message || 'Failed to send SMS' });
    }

    res.status(200).send({ sid: data.sid, otpLink });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send({ error: error.message });
  }
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
