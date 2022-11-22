const nodemailer = require('nodemailer');

require('dotenv').config({ path: `${require.main.path}/.env` });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: 'adrianmota152@gmail.com',
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;