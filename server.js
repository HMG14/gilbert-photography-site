/**
 * Gilbert B Hammer Photography — Express server
 *
 * Environment variables required for the contact form:
 *   BREVO_API_KEY   — Brevo (Sendinblue) transactional email API key
 *   PORT            — set automatically by Railway; defaults to 3000 locally
 *
 * Contact form recipient: gilbert@hammermediagroup.com
 * Sender: gilbert@hammermediagroup.com (must be verified in Brevo — same
 * sender already verified for the preserve site works here too)
 */

'use strict';

const express = require('express');
const path    = require('path');
const fetch   = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const app  = express();
const PORT = process.env.PORT || 3000;

const BREVO_API_KEY   = process.env.BREVO_API_KEY;
const RECIPIENT_EMAIL = 'gilbert@hammermediagroup.com';
const RECIPIENT_NAME  = 'Gilbert Hammer';
const SENDER_EMAIL    = 'gilbert@hammermediagroup.com'; // verified Brevo sender
const SENDER_NAME     = 'Gilbert B Hammer Photography';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not set.');
    return res.status(500).json({ error: 'Server misconfiguration.' });
  }

  const phoneLine = phone ? `\nPhone: ${phone}` : '';
  const textBody  = `New photography inquiry\n\nName: ${name}\nEmail: ${email}${phoneLine}\n\nMessage:\n${message}`;
  const htmlBody  = `
    <h2 style="font-family:sans-serif;">New photography inquiry</h2>
    <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;">
      <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Name</td><td>${escHtml(name)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Email</td><td><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>
      ${phone ? `<tr><td style="padding:4px 12px 4px 0;font-weight:600;">Phone</td><td>${escHtml(phone)}</td></tr>` : ''}
    </table>
    <p style="font-family:sans-serif;font-size:15px;margin-top:20px;"><strong>Message:</strong><br>${escHtml(message).replace(/\n/g, '<br>')}</p>
  `;

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept':       'application/json',
        'api-key':      BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender:   { name: SENDER_NAME,    email: SENDER_EMAIL },
        to:       [{ name: RECIPIENT_NAME, email: RECIPIENT_EMAIL }],
        replyTo:  { name, email },
        subject:  `Photography inquiry from ${name}`,
        textContent: textBody,
        htmlContent: htmlBody,
      }),
    });

    if (!brevoRes.ok) {
      const detail = await brevoRes.text();
      console.error('Brevo error:', detail);
      return res.status(502).json({ error: 'Email delivery failed.' });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Gilbert B Hammer Photography server running on port ${PORT}`);
});

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
