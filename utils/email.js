const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

async function sendPasswordEmail(email, password) {
	const oauth2Client = new google.auth.OAuth2(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET
	);

	oauth2Client.setCredentials({
		refresh_token: process.env.REFRESH_TOKEN,
	});

	const accessToken = await oauth2Client.getAccessToken();

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: process.env.EMAIL_USER,
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			refreshToken: process.env.REFRESH_TOKEN,
			accessToken: accessToken,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "🚗 Votre mot de passe GoCar",
		html: `
			<div style="background-color: #f2f2f2; padding: 20px;">
				<h1 style="color: #ff6600;">GoCar</h1>
				<p style="font-size: 18px;">Bonjour,</p>
				<p style="font-size: 18px;">Voici votre mot de passe pour accéder à votre compte GoCar :</p>
				<p style="font-size: 24px; font-weight: bold; color: #ff6600;">${password}</p>
				<p style="font-size: 18px;">Nous vous souhaitons d'excellents voyages avec GoCar ! 🌞</p>
				<p style="font-size: 16px;">L'équipe GoCar</p>
			</div>
		`,
	};

	const info = await transporter.sendMail(mailOptions);

	console.log("Message envoyé : %s", info.messageId);
}

module.exports = sendPasswordEmail;
