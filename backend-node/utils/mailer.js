const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use 'host' and 'port' for other providers
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = async (to, name) => {
    try {
        const mailOptions = {
            from: `"EstateAI" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: 'Welcome to EstateAI!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #3b82f6;">Welcome to EstateAI, ${name}!</h1>
                    <p>We are thrilled to have you on board.</p>
                    <p>Start your journey today:</p>
                    <ul>
                        <li>Find your dream home</li>
                        <li>List your property for sale</li>
                        <li>Connect with top agents</li>
                    </ul>
                    <p>If you have any questions, feel free to reply to this email.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>The EstateAI Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};

module.exports = { sendWelcomeEmail };
