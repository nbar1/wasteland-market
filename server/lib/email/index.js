var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_GMAIL_USERNAME,
		pass: process.env.EMAIL_GMAIL_PASSWORD,
	},
});

const sendMail = (to, subject, message, callback) => {
	var mailOptions = {
		from: process.env.EMAIL_SEND_FROM,
		replyTo: process.env.EMAIL_REPLY_TO,
		to,
		subject,
		html: message,
	};

	transporter.sendMail(mailOptions, callback);
};

module.exports = sendMail;
