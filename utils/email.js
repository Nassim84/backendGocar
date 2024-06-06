const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
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

	const logoPath = path.join(__dirname, "..", "public", "logo.png");
	const logoBuffer = fs.readFileSync(logoPath);
	const logoBase64 = logoBuffer.toString("base64");

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "🚗 Votre mot de passe GoCar",
		html: `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                        border-bottom: 1px solid #eeeeee;
                    }
                    .header img {
                        max-width: 100px;
                    }
                    .content {
                        padding: 20px 0;
                    }
                    .content h1 {
                        font-size: 24px;
                        color: #333333;
                    }
                    .content p {
                        font-size: 16px;
                        color: #555555;
                        line-height: 1.5;
                    }
                    .footer {
                        text-align: center;
                        padding: 10px 0;
                        border-top: 1px solid #eeeeee;
                        margin-top: 20px;
                        color: #888888;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                    	<img src="data:image/png;base64,${logoBase64}" alt="GoCar Logo">
                    </div>
                    <div class="content">
                        <h1>Votre mot de passe temporaire</h1>
                        <p>Bonjour,</p>
                        <p>Votre nouveau mot de passe temporaire est : <strong>${password}</strong></p>
                        <p>Merci d'utiliser notre service GoCar. Nous vous recommandons de changer votre mot de passe dès votre prochaine connexion.</p>
                    </div>
                    <div class="footer">
                        &copy; 2024 GoCar. Tous droits réservés.
                    </div>
                </div>
            </body>
            </html>
        `,
	};

	const info = await transporter.sendMail(mailOptions);

	console.log("Message envoyé : %s", info.messageId);
}

module.exports = sendPasswordEmail;
