const nodemailer = require('nodemailer');

// SMTP settings come from Vercel Environment Variables (never commit credentials).
const {
    SMTP_HOST,
    SMTP_PORT = '465',
    SMTP_USER,
    SMTP_PASS,
    MAIL_FROM,
    MAIL_FROM_NAME = 'Hassan Portfolio',
    MAIL_TO = 'hassanjamal8735@gmail.com',
} = process.env;

const clean = (value) => String(value || '').trim();

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).send('ERROR: Method not allowed');
    }

    const body = req.body || {};
    const mail = clean(body.mail);
    const phone = clean(body.phone);
    const message = clean(body.message);

    if (!mail || !phone || !message) {
        return res.status(400).send('ERROR: All fields are required');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) || mail.length > 200 || phone.length > 50 || message.length > 5000) {
        return res.status(400).send('ERROR: Invalid input');
    }

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.error('Contact form: SMTP environment variables are not configured');
        return res.status(500).send('ERROR: Mail server not configured');
    }

    const port = Number(SMTP_PORT);
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    try {
        await transporter.sendMail({
            from: `"${MAIL_FROM_NAME}" <${MAIL_FROM || SMTP_USER}>`,
            to: MAIL_TO,
            replyTo: mail,
            subject: `New Contact from Portfolio — ${mail}`,
            text:
                'You have a new message from your portfolio contact form.\n\n' +
                `From:    ${mail}\n` +
                `Phone:   ${phone}\n\n` +
                `Message:\n${message}\n`,
        });
        return res.status(200).send('Success');
    } catch (err) {
        console.error('Contact form: failed to send', err);
        return res.status(500).send('ERROR: Message not sent');
    }
};
