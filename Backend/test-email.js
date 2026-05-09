const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('--- Email Configuration Test ---');
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '******** (Hidden)' : 'MISSING');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: process.env.SMTP_EMAIL, // Send to yourself
    subject: 'AXIS Email Test',
    text: 'If you see this, your email configuration is working perfectly!',
};

console.log('\nSending test email...');

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('\n❌ ERROR FOUND:');
        console.log('----------------');
        console.log(error.message);
        console.log('----------------');
        
        if (error.message.includes('Invalid login')) {
            console.log('\n💡 TIP: Your Gmail App Password is likely incorrect.');
            console.log('Make sure you copied all 16 characters correctly from Google.');
        } else if (error.message.includes('EAI_AGAIN')) {
            console.log('\n💡 TIP: This looks like a network or DNS issue. Are you connected to the internet?');
        }
    } else {
        console.log('\n✅ SUCCESS!');
        console.log('Email sent: ' + info.response);
        console.log('Check your inbox (and spam folder) for the test email.');
    }
});
